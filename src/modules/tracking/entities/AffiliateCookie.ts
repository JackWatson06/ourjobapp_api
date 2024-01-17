
/**
 * Original Author: Jack Watson
 * Created Date: 10/30/2021
 * Purpose: With the affiliate cookie we can keep track of who signed up through what affiliate link on the front
 * end portion of the website.
 */

export default class AffiliateCookie{

    private affiliateId: string;


    constructor(affiliateId: string)
    {
        this.affiliateId = affiliateId;
    }

    /**
     * Get the id of the affiliate cookie.
     */
    public getId()
    {
        return this.affiliateId;
    }
}