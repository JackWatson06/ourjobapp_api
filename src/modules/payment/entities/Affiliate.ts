import Identification from "./Identification";
import Charity from "./Charity";
import Payout from "./Payout";
import Reward from "./Reward";
import PaymentPlan from "./PaymentPlan";
import Donation from "./Donation";

export default class Affiliate
{
    private identity: Identification;

    private charity: Charity;

    private parent ?: Affiliate;
    
    private child ?: Affiliate;

    constructor(identity: Identification, charity: Charity)
    {
        this.identity = identity;
        this.charity = charity;
    }

    /**
     * Link an affiliate to this current affiliate. This will prudct a single linked list between the two affiiliats. 
     * @param affiliate Affilaite we want to nest underneath this affiliate
     */
    public linkAffiliate(affiliate: Affiliate)
    {
        // If neither of the affliates are linked.
        if( this.parent === undefined && 
            this.child === undefined && 
            !affiliate.getAffiliate() )
        {
            this.child = affiliate;
            affiliate.linkAffiliate(this);
        }
        // If this class does not have link but parent does then set parent.
        else if(
            this.parent === undefined && 
            this.child === undefined)
        {
            this.parent = affiliate;
        }
    }

    /**
     * Create a payout for the affiliate 
     */
    public pay(): Array<Payout>
    {
        const payouts: Array<Payout> = [];
        const depth = this.parent != undefined ? 1 : 0;

        payouts.push(new Payout(
            new Reward(PaymentPlan.AFFILIATE_PAYOUTS[depth], this.identity.getPhone(), this.identity.getId()),
            new Donation(PaymentPlan.CHARITY_PAYOUTS[depth], this.charity)
        ))

        // If we have more than one child then add their payouts.
        if(this.child != undefined)
        {
            payouts.push(...this.child.pay());
        }

        return payouts;
    }

    /**
     * Get the affiliate that we have attached.
     */
    public getAffiliate(): Affiliate|undefined
    {
        return this.child;
    }
}
