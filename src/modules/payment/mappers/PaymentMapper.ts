/**
 * This file serves to map the payment aggregate root to the database so that we can keep records of all the payments
 * that are moving through out system.
 */

import { collections, toObjectId } from "db/MongoDb";
import { Schema } from "db/DatabaseSchema";

import Payment from "../entities/Payment";
import Affiliate from "../entities/Affiliate";
import Charity from "../entities/Charity";
import Identification from "../entities/Identification";

import { ObjectId } from "mongodb";

type UpdateQuery = {
    success     : boolean,
    error       : boolean,
    canceled    : boolean,

    executed_at ?: number,
    canceled_at ?: number
}

/**
 * Map the affiliates to the correct entity. Either we have an affiliate or we don't with undefined.
 * @param collection Collections we are allowed to map the affilaites of.
 * @param affiliates The current runing total of the affiliates
 * @param depth How far down are we the chain already
 */
async function mapAffiliates(affiliateId: ObjectId, depth: number = 0): Promise<Affiliate|undefined>
{   
    const affiliateRow: Schema.Affiliate|null = await collections.affiliates.findOne({ _id: affiliateId });

    if(affiliateRow === null || affiliateRow._id === undefined || depth === 2 )
    {
        return undefined;
    }

    const affiliate = new Affiliate(
        new Identification(affiliateRow._id.toString(), affiliateRow.phone),
        new Charity(affiliateRow.charity_id.toString())
    );

    // We have a nested affiliate.
    if(affiliateRow.affiliate_id != undefined)
    {
        const nestedAffiliate: Affiliate|undefined = await mapAffiliates(affiliateRow.affiliate_id, depth++);

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
    const paymentRow: Schema.Payment|null = await collections.payments.findOne({ paypal_id: paymentId });
    
    if(paymentRow === null)
    {
        return null;
    }

    const employerQuery = { _id: paymentRow.employer_id };
    const employeeQuery = { _id: paymentRow.employee_id };
    
    // Get all the affiliates of affiliates if we have them.
    const employerRow: Schema.Employer|null = await collections.employers.findOne(employerQuery);
    const employeeRow: Schema.Employee|null = await collections.employees.findOne(employeeQuery);
    
    const payment: Payment = new Payment(paymentRow.paypal_id);

    // Add the employers affiliates if we have any of them.
    if(employerRow != null && employerRow.affiliate_id != undefined)
    {   
        const affiliate: Affiliate|undefined = await mapAffiliates(employerRow.affiliate_id);

        if(affiliate != undefined)
        {
            payment.addAffiliate( affiliate );
        }
    }

    // Add the employees affilaites if we have any of them.
    if(employeeRow != null && employeeRow.affiliate_id != undefined)
    {
        const affiliate: Affiliate|undefined = await  mapAffiliates(employeeRow.affiliate_id);

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
    const updatePayment: UpdateQuery = {
        success     : payment.getSuccess(),
        error       : payment.getError(),
        canceled    : payment.getCanceled(),

        executed_at  : payment.getExecutedAt(),
        canceled_at  : payment.getCanceledAt()
    }

    const paymentQuery = { paypal_id: payment.getId() };

    // Update and return the identifier for the paymentId;
    const paymentId: ObjectId|undefined = ( await collections.payments.findOneAndUpdate(paymentQuery, { $set: updatePayment }) ).value?._id;


    if(paymentId != undefined)
    {
        for(const payout of payment.getPayouts())
        {
            await collections.payouts.insertOne({
                affiliate_id     : toObjectId( payout.getReward().getAffiliateId() ),
                payment_id       : paymentId,
                charity_id       : toObjectId( payout.getDonation().getCharity().getId() ),
                batch_id         : payout.getBatchId(),
                
                amount           : payout.getReward().getAmount(),
                donation         : payout.getDonation().getAmount(),
                currency         : payout.getCurrency(),
                sent_at          : payout.getSentAt(),
                
                success          : payout.getSuccess(),
                error            : payout.getError(),
            });
        }
    }

    return true;
}
