/**
 * Original Author: Jack Watson
 * Created Date: 11/5/2021
 * Purpose: This class is in charge of paying the affiliate their due dilligance based on a successful payment.
 */

import PaymentPlan from "./PaymentPlan";

import Reward from "./Reward";
import Donation from "./Donation";

import { PaymentAdaptor } from "infa/PaymentAdaptor";

export default class Payout
{
    // The reward to the affilaite assoicated with this payout.
    private reward: Reward;

    // The donation associated with this payout.
    private donation: Donation;

    // Was this payout successfully sent?
    private success: boolean;

    // Did this payout have an error when we tried to send?
    private error: boolean;

    // Get the data that we sent over the payout.
    private sentAt: number;

    constructor(reward: Reward, donation: Donation)
    {
        this.reward   = reward;
        this.donation = donation;
        this.success  = false;
        this.error    = false;
    }

    /**
     * Send a payment to an
     * @param paymentAdaptor Payment infastructure
     */
    public async send(paymentAdaptor: PaymentAdaptor): Promise<boolean>
    {
        const amount = this.reward.getAmount();
        const email  = this.reward.getEmail();   // Thats a doozy

        this.sentAt = Date.now();
        try{
            paymentAdaptor.payout(amount, email);
            this.success = true;
            return true;
        }
        catch(error)
        {
            this.error = true;
            return false;
        }
    }

    // === GETTERS ===
    public getSuccess()
    {
        return this.success;
    }

    public getError()
    {
        return this.error;
    }

    public getSentAt()
    {
        return this.sentAt;
    }

    public getReward()
    {
        return this.reward;
    }

    public getDonation()
    {
        return this.donation;
    }

    public getCurrency() : string
    {
        return PaymentPlan.CURRENCY;
    }
}
