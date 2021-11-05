/**
 * Original Author: Jack Watson
 * Created Date: 11/4/2021
 * Purpose: This class represents the aggregate root for the Payment class. A payment is simply some object that has a 
 * id which represents the current payment. This class will also hold all of the affiliates tied to the payment. As well
 * as any payouts that we are going to be sending out of the system.
 */

import Affiliate from "./Affiliate";
import { PaymentAdaptor, PayoutCreateRequest } from "infa/PaymentAdaptor";
import Payout from "./Payout";

export default class Payment
{
    private id: string;

    // List of affiliates who will get paid on a successful payment.
    private affiliates: Array<Affiliate>;

    // List of payouts that this class has.
    private payouts: Array<Payout>;

    // These represent different stages of a statemachine.
    // If this payment has an error DO NOT payout to affiliates.
    private error: boolean;

    // Is this payment in a success state. Thats when we know to push out the payouts to affiliates.
    private success: boolean;

    // Is this payment in a success state. Thats when we know to push out the payouts to affiliates.
    private canceled: boolean;

    // Get the time the payment was actual executed to move funds
    private executed_at: number;
    
    // Date when the payment was canceled.
    private canceled_at: number;

    constructor(id: string)
    {
        this.id         = id;
        this.affiliates = [];
        this.payouts    = [];
        this.error      = false;
        this.success    = false;
        this.canceled   = false;
    }

    /**
     * Add a affiliate who can recieve a payout from this payment object.
     * @param affiliate Affilaite we want to add to the payment
     */
    public addAffiliate(affiliate: Affiliate): void
    {
        if(this.affiliates.length === 2)
        {
            throw "You can only add two affiliates.";
        }
        this.affiliates.push(affiliate);
    }

    /**
     * Cancel the payment
     */
    public cancel()
    {
        this.canceled_at = Date.now();
        this.canceled    = true;
    }

    /**
     * Execute the payment against whatever adaptor we have passed in (right now were using paypal)
     * @param payment Adaptor for the payment
     */
    public async execute(payment: PaymentAdaptor, payerId: string): Promise<boolean>
    {
        try
        {
            this.executed_at = Date.now();
            await payment.finalize(this.id, payerId);

            this.success = true;
            return true;
        }
        catch(error)
        {
            this.error = true;
            return false;
        }
    } 

    /**
     * Payout this payment to all of the affiliates that are associated with it.
     */
    public async sendPayouts(payment: PaymentAdaptor): Promise<void>
    {
        const payoutRequests: Array<PayoutCreateRequest> = this.payouts.map((payout) => ({
            amount: payout.getReward().getAmount(),
            email: payout.getReward().getEmail()
        }));

        try{
            const batchId: string = await payment.payout(payoutRequests);
            this.payouts.forEach((payout) => payout.sent(batchId));
        }
        catch(error)
        {
            this.payouts.forEach((payout) => payout.failedSending());
        }
    }

    /**
     * Payout this payment to all of the affiliates that are associated with it.
     */
    public payout(): void
    {
        if( !this.success )
        {
            throw "You can not payout affiliates if the payment was unsuccessful";
        }

        for(const affiliate of this.affiliates)
        {
            this.payouts.push(...affiliate.pay());
        }
    }

    // === GETTERS ===

    public getId(): string
    {
        return this.id;
    }

    public getAffiliates(): Array<Affiliate>
    {
        return this.affiliates;
    }

    public getPayouts(): Array<Payout>
    {
        return this.payouts;
    }


    // State stuff below
    public getSuccess(): boolean
    {
        return this.success;
    }

    public getError(): boolean
    {
        return this.error;
    }

    public getCanceled(): boolean
    {
        return this.canceled;
    }

    public getExecutedAt(): number|undefined
    {
        return this.executed_at;
    }

    public getCanceledAt(): number|undefined
    {
        return this.canceled_at;
    }
}
