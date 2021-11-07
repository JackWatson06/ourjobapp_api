/**
 * Original Author: Jack Watson
 * Created Date: 11/5/2021
 * Purpose: This class serves to handle interactions with the paypal API infastrucutre. We dependo on a interface just
 * in case we will want to change this in the future. This acts as an Adaptor pattern.
 * 
 * PayPal Hanldes Payments the following way:
 * 
 * 1. Create PayPal Payment (create method)
 * 2. Get Payment Approval (create method returning approval url)
 * 3. Execute approved payment (finalize)
 * 
 */

import {PaymentAdaptor, PaymentCreateResponse, PayoutCreateRequest} from "./PaymentAdaptor";
import paypal from "paypal-rest-sdk";

/**
 * Get the approvial URL from the payment process API.
 * @param payment Payment response coming from the paypal API.
 */
function getApprovalUrlFromPaypalPaymentResponse(payment: paypal.PaymentResponse): string|undefined
{
    if(payment.links === undefined)
    {
        return undefined;
    }

    for(let i = 0;i < payment.links.length;i++){
      if(payment.links[i].rel === 'approval_url'){
        return payment.links[i].href;
      }
    }

    return undefined;
}

export default class PayPalAdaptor implements PaymentAdaptor
{
    /**
     * Execute a payment using the paypal API. We will also need a execute payment once we get paypals proper terminology.
     */
    public async create(amount: number): Promise<PaymentCreateResponse>
    {
        const createPaymentJson: paypal.Payment = {
            "intent": "sale",
            "payer": {
                "payment_method": "paypal"
            },
            "redirect_urls": {
                "return_url": `${process.env.DOMAIN}/api/v1/payment/success`,
                "cancel_url": `${process.env.DOMAIN}/api/v1/payment/cancel`
            },
            "transactions": [{
                "item_list": {
                    "items": [{
                        "name": "Hire Candidate",   // Get the candidate name
                        "price": `${amount}`,
                        "currency": "USD",
                        "quantity": 1
                    }]
                },
                "amount": {
                    "currency": "USD",
                    "total": `${amount}`
                },
                "description": "Hire your candidate through ourjob.app"
            }]
        };

        return new Promise( (resolve, reject) => {
            paypal.payment.create(createPaymentJson, function (error, payment) {
                if (error) {
                    reject(error);
                } else {
                    // This approval URL 
                    const url: string|undefined = getApprovalUrlFromPaypalPaymentResponse(payment);
                    const id: string|undefined  = payment.id;

                    if(url != undefined && id != undefined)
                    {
                        resolve({
                            id: id,
                            redirect: url
                        });
                    }

                    reject("Could not parse necessary paramters from the payment.");
                }
            });
        } )
    }

    /**
     * Finalize the paypal order.
     * @param paymentId The payment ID of the Paypal order
     * @param payerId The payer id for the order.... store that in the database.
     */
    public async finalize(paymentId: string, payerId: string): Promise<boolean>
    { 
        const executePaymentJson: paypal.payment.ExecuteRequest = {
          "payer_id": payerId
        };
      
        return new Promise((resolve, reject) => {
            paypal.payment.execute(paymentId, executePaymentJson, function (error, payment) {

                if (error) {
                    reject(false);
                } else {
                    resolve(true);
                }
            });
        });
    }

    /**
     * Payout all the people in the list who are included in the batch. Currently based off of our business logic their
     * are a total of 4 individuals who can be notified of a payout at a single time.
     * @param payouts Batch of payout create requests that we will send to all the people in the list.
     */
    public async payout(payouts: Array<PayoutCreateRequest>): Promise<string>
    {   
        const createPayoutJson = {
            "sender_batch_header": {
                "sender_batch_id": `PAYOUT_${Date.now()}`,
                "email_subject": "Claim Your Affiliate Reward!"
            },
            "items": [
                ...payouts.map((payout) => {
                    return {
                        "recipient_type": "EMAIL",
                        "amount": {
                            "value": payout.amount,
                            "currency": "USD"
                        },
                        "receiver": payout.email,
                        "note": "Thank you for helping someone find a job!",
                    }
                })
            ]
        };

        return new Promise((resolve, reject) => {
            paypal.payout.create(createPayoutJson, function (error: string, payout: any) {

                if (error) 
                {
                    reject(error);
                }

                if(payout.batch_header.payout_batch_id === undefined)
                {
                    reject("Could not get the payout batch id from the response.");
                }

                resolve(payout.batch_header.payout_batch_id);
            });
        });
    }
}
