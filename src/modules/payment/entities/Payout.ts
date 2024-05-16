/**
 * This class is in charge of paying the affiliate their due dilligance based on a successful payment.
 */
import PaymentPlan from "./PaymentPlan";

import Reward from "./Reward";
import Donation from "./Donation";

export default class Payout
{
    private reward: Reward;
    private donation: Donation;
    private batchId: string
    private success: boolean;
    private error: boolean;
    private sentAt: number;

    constructor(reward: Reward, donation: Donation)
    {
        this.reward   = reward;
        this.donation = donation;
        this.success  = false;
        this.error    = false;
        this.batchId  = "";
    }

    /**
     * The state of this object is managed by the payment object we will want to refactor this into a GROUP of 
     * @param status Set the status that this payout object currently has.
     */
    public sent(batchId : string)
    {
        this.success = true;
        this.sentAt  = Date.now();
        this.batchId = batchId;
    }

    /**
     * Faile the sending of the payout object
     */
    public failedSending(): void
    {
        this.error = true;
    }

    public getSuccess(): boolean
    {
        return this.success;
    }

    public getError(): boolean
    {
        return this.error;
    }

    public getSentAt(): number
    {
        return this.sentAt;
    }

    public getBatchId(): string
    {
        return this.batchId;
    }

    public getReward(): Reward
    {
        return this.reward;
    }

    public getDonation(): Donation
    {
        return this.donation;
    }

    public getCurrency() : string
    {
        return PaymentPlan.CURRENCY;
    }
}
