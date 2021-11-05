/**
 * Original Author: Jack Watson
 * Created Date: 5/11/2021
 * Purpose: This file persists the PaymentRequest aggregate root to the database for us to hopefully further process
 * in the future.
 */

import * as MongoDb from "infa/MongoDb";
import * as Collections from "Collections";
import PaymentRequest from "../entities/PaymentRequest";

/**
 * Store the payment request that we just got in in the database.
 * @param paymentRequest Payment request we are persisting to the database
 */
export async function create( paymentRequest: PaymentRequest ): Promise<boolean>
{
    const db: MongoDb.MDb = MongoDb.db();

    const payment: Collections.Payment = {
        employer_id : MongoDb.toObjectId( paymentRequest.getEmployerId() ),
        employee_id : MongoDb.toObjectId( paymentRequest.getEmployeeId() ),
    
        paypal_id   : paymentRequest.getPaymentId(), // Information amount the actual payment.
        currency    : paymentRequest.getCurrency(),
        amount      : paymentRequest.getAmount(),
    
        success     : false, // State the payment is in.
        error       : false, // State the payment is in.
    
        started_at  : MongoDb.now(), // Time the payment was started from the paypal redirect
    }

    return ( await db.collection("payments").insertOne(payment)).acknowledged;
}
