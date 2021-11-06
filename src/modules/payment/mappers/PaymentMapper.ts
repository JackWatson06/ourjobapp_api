/**
 * Original Author: Jack Watson
 * Created Date: 5/11/2021
 * Purpose: This file serves to map the payment aggregate root to the database so that we can keep records of all the payments
 * that are moving through out system.
 */

import * as MongoDb from "infa/MongoDb";
import * as Collections from "Collections";

import Payment from "../entities/Payment";
import Affiliate from "../entities/Affiliate";
import Charity from "../entities/Charity";
import Identification from "../entities/Identification";

import { ObjectId } from "mongodb";

type UpdateQuery = {
    success     : boolean, // State the payment is in.
    error       : boolean, // State the payment is in.
    canceled    : boolean,

    executed_at ?: number, // Time the payment was started from the paypal redirect
    canceled_at ?: number
}

/**
 * Map the affiliates to the correct entity. Either we have an affiliate or we don't with undefined.
 * @param collection Collections we are allowed to map the affilaites of.
 * @param affiliates The current runing total of the affiliates
 * @param depth How far down are we the chain already
 */
async function mapAffiliates(db: MongoDb.MDb, affiliateId: ObjectId, depth: number = 0): Promise<Affiliate|undefined>
{   
    const affiliateRow: Collections.Affiliate|null = await db.collection("affiliates").findOne<Collections.Affiliate>({ _id: affiliateId });

    if(affiliateRow === null || affiliateRow._id === undefined || depth === 2 )
    {
        return undefined;
    }

    const affiliate = new Affiliate(
        new Identification(affiliateRow._id.toString(), affiliateRow.email),
        new Charity(affiliateRow.charity_id.toString())
    );

    // We have a nested affiliate.
    if(affiliateRow.affiliate_id != undefined)
    {
        const nestedAffiliate: Affiliate|undefined = await mapAffiliates(db, affiliateRow.affiliate_id, depth++);

        if(nestedAffiliate != undefined)
        {
            affiliate.linkAffiliate(nestedAffiliate);
        }
    }

    return affiliate;
}

/**
 * Store the payment request that we just got in in the database.
 * @param paymentRequest Payment request we are persisting to the database
 */
export async function read( paymentId: string ): Promise<Payment|null>
{
    const db: MongoDb.MDb = MongoDb.db();

    const paymentRow: Collections.Payment|null = await db.collection("payments").findOne<Collections.Payment>({ paypal_id: paymentId });
    
    if(paymentRow === null)
    {
        return null;
    }

    const employerQuery = { _id: paymentRow.employer_id };
    const employeeQuery = { _id: paymentRow.employee_id };
    
    // Get all the affiliates of affiliates if we have them.
    const employerRow: Collections.Employer|null = await db.collection("employers").findOne<Collections.Employer>(employerQuery);
    const employeeRow: Collections.Employee|null = await db.collection("employees").findOne<Collections.Employee>(employeeQuery);
    
    const payment: Payment = new Payment(paymentRow.paypal_id);

    // Add the employers affiliates if we have any of them.
    if(employerRow != null && employerRow.affiliate_id != undefined)
    {   
        const affiliate: Affiliate|undefined = await mapAffiliates(db, employerRow.affiliate_id);

        if(affiliate != undefined)
        {
            payment.addAffiliate( affiliate );
        }
    }

    // Add the employees affilaites if we have any of them.
    if(employeeRow != null && employeeRow.affiliate_id != undefined)
    {
        const affiliate: Affiliate|undefined = await  mapAffiliates(db, employeeRow.affiliate_id);

        if(affiliate != undefined)
        {
            payment.addAffiliate( affiliate );
        }
    }

    return payment;
}


/**
 * Store the updated payment in the database. Simply map the state.
 * @param payment Payment we are persisting to the database.
 */
export async function update( payment: Payment ): Promise<boolean>
{
    const db: MongoDb.MDb = MongoDb.db();

    const updatePayment: UpdateQuery = {
        success     : payment.getSuccess(), // State the payment is in.
        error       : payment.getError(), // State the payment is in.
        canceled    : payment.getCanceled(),

        executed_at  : payment.getExecutedAt(), // Time the payment was started from the paypal redirect
        canceled_at  : payment.getCanceledAt()
    }

    const paymentQuery = { paypal_id: payment.getId() };

    // Update and return the identifier for the paymentId;
    const paymentId: ObjectId|undefined = ( await db.collection("payments")
        .findOneAndUpdate(paymentQuery, { $set: updatePayment }) ).value?._id;


    if(paymentId != undefined)
    {
        for(const payout of payment.getPayouts())
        {
            const payoutRow: Collections.Payout = {
                affiliate_id     : MongoDb.toObjectId( payout.getReward().getAffiliateId() ),
                payment_id       : paymentId,
                charity_id       : MongoDb.toObjectId( payout.getDonation().getCharity().getId() ),
                batch_id         : payout.getBatchId(),
                
                amount           : payout.getReward().getAmount(),
                donation         : payout.getDonation().getAmount(),
                currency         : payout.getCurrency(),
                sent_at          : payout.getSentAt(),
                
                success          : payout.getSuccess(),
                error            : payout.getError(),
            }

            await db.collection("payouts").insertOne(payoutRow);
        }
    }

    return true;
}
