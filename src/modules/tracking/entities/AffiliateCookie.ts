/**
 * With the affiliate cookie we can keep track of who signed up through what affiliate link on the front
 * end portion of the website.
 */

export default class AffiliateCookie{

    private affiliateId: string;

    constructor(affiliateId: string)
    {
        this.affiliateId = affiliateId;
    }

    public getId()
    {
        return this.affiliateId;
    }
}