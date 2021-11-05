import Charity from "./Charity";

export default class Donation{

    private amount: number;
    private charity: Charity;

    constructor(amount: number, charity: Charity)
    {
        this.amount = amount;
        this.charity = charity;
    }

    public getAmount()
    {
        return this.amount;
    }

    public getCharity()
    {
        return this.charity;
    }
}

