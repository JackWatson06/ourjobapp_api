/**
 * This file persists the PaymentRequest aggregate root to the database for us to hopefully further process
 * in the future.
 */

import {collections, toObjectId, now} from "db/MongoDb";
import PaymentRequest from "../entities/PaymentRequest";

/**
 * Store the payment request that we just got in in the database.
 * @param paymentRequest Payment request we are persisting to the database
 */
export async function create( paymentRequest: PaymentRequest ): Promise<boolean>
{
    return ( await collections.payments.insertOne({
        employer_id : toObjectId( paymentRequest.getEmployerId() ),
        employee_id : toObjectId( paymentRequest.getEmployeeId() ),
    
        paypal_id   : paymentRequest.getPaymentId(),
        currency    : paymentRequest.getCurrency(),
        amount      : paymentRequest.getAmount(),
    
        success     : false,
        error       : false,
    
        started_at  : now(),
    })).acknowledged;
}
