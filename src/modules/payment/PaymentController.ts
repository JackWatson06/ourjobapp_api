/**
 * This class controls the payment process. We use paypal currently to pay the people who are in charge of the
 * affiliates, as well as paying the employers.
 * 
 * Nice I am pretty happy with this file!
 */
import express from "express";

import PayPalAdaptor from "payment/PayPalAdaptor";
import PaymentRequest from "./entities/PaymentRequest";
import Payment from "./entities/Payment";

import * as PaymentRequestMapper from "./mappers/PaymentRequestMapper";
import * as PaymentMapper from "./mappers/PaymentMapper";

/**
 * Start a new payment that the employer triggered to hire an employee.
 * 
 * Couple things to know about this route. We are using the query parameters instead of having this be a post route becuase
 * this route will be triggered from the EMAIL. That gets sent out to the employer. So we don't have the ability to post
 * in the email.
 * 
 * @param req Request object
 * @param res Response ojbect
 */
export async function start(req: express.Request, res: express.Response)
{
    const employerIdentity: string = req.query.epi as string;
    const employeeIdentity: string = req.query.emi as string;

    const payPal: PayPalAdaptor   = new PayPalAdaptor();
    const payment: PaymentRequest = new PaymentRequest(employerIdentity, employeeIdentity);
    
    const success: boolean = await payment.processPayment(payPal);
    
    // If we could not process the payment then don't even mark it as a payment in the database.
    if(!success)
    {
        return res.status(400).send(); 
    }

    // If we can actually process payment then persist
    await PaymentRequestMapper.create(payment);

    // Redirect the user to wherever the paypal API wants us.
    return res.redirect(payment.getRedirect());
}

/**
 * Mark the payment as successful. This will still need to be authorized by paypal. This workflow has a cuople of different
 * steps to confirm the payment was successful.
 * 
 * 1. Get the valid payment from the database.
 * 2. Execute the payment so that we can confirm we have the funds.
 * 3. On successful execute generate payouts.
 * 4. Send out our payouts to the affiliates.
 * 
 * @param req Request object
 * @param res Response ojbect
 */
export async function success(req: express.Request, res: express.Response)
{
    const payerId:   string = req.query.PayerID as string;
    const paymentId: string = req.query.paymentId as string;

    const payPal: PayPalAdaptor = new PayPalAdaptor();

    // Get domain objects, and conduct different actions on them.
    const payment: Payment|null = await PaymentMapper.read(paymentId);
    
    if(payment === null)
    {
        return res.status(400).send();
    }
    
    const execute: boolean = await payment.execute(payPal, payerId);
    

    // If we could not get the funds then DO NOT authroize a payment. This should be theoretically impossible given our
    // domain models.... so be careful changing those.
    if(!execute)
    {
        return res.status(400).send(); 
    }

    // Payout the affiliates.
    payment.payout();
    await payment.sendPayouts(payPal);

    // If we can actually process payment then persist
    await PaymentMapper.update(payment);
    
    // Redirect the user to wherever the paypal API wants us.
    return res.redirect(process.env.CLIENT_DOMAIN);
}

/**
 * Cancel a current payment.
 * @param req Request object
 * @param res Response ojbect
 */
export async function cancel(req: express.Request, res: express.Response)
{
    const paymentId: string = req.query.paymentId as string;

    // Get domain objects, and conduct different actions on them.
    const payment: Payment|null = await PaymentMapper.read(paymentId);
    
    if(payment === null)
    {
        return res.status(400).send();
    }

    payment.cancel();

    await PaymentMapper.update(payment);

    // Redirect the user to wherever the paypal API wants us.
    return res.redirect(process.env.CLIENT_DOMAIN);
}
