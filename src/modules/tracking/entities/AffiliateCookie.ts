

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