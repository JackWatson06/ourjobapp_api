export default class Reward
{
    private amount: number;
    private email: string;
    private affiliateId: string;

    constructor(amount: number, email: string, affiliateId: string)
    {
        this.amount = amount;
        this.email = email;
        this.affiliateId = affiliateId;
    }

    // === GETTERS ===
    public getAmount(): number
    {
        return this.amount;
    }

    public getEmail(): string
    {
        return this.email;
    }

    public getAffiliateId(): string
    {
        return this.affiliateId;
    }
}