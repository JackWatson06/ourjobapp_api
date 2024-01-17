export default class Reward
{
    private amount: number;
    private phone: string;
    private affiliateId: string;

    constructor(amount: number, phone: string, affiliateId: string)
    {
        this.amount = amount;
        this.phone = phone;
        this.affiliateId = affiliateId;
    }

    // === GETTERS ===
    public getAmount(): number
    {
        return this.amount;
    }

    public getPhone(): string
    {
        return this.phone;
    }

    public getAffiliateId(): string
    {
        return this.affiliateId;
    }
}