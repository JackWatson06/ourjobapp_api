/**
 * Original Author: Jack Watson
 * Created Date: 11/4/2021
 * Purpose: This class controls the payment process. We use paypal currently to pay the people who are in charge of the
 * affiliates, as well as paying the employers.
 */
import express from "express";


/**
 * Start a new payment that the employer triggered to hire an employee.
 * @param req Request object
 * @param res Response ojbect
 */
export async function start(req: express.Request, res: express.Response)
{
    



}

/**
 * Mark the payment as successful. This will still need to be authorized by paypal.
 * @param req Request object
 * @param res Response ojbect
 */
export async function success(req: express.Request, res: express.Response)
{

}

/**
 * Cancle a current payment.
 * @param req Request object
 * @param res Response ojbect
 */
export async function cancel(req: express.Request, res: express.Response)
{

}
