/**
 * This value object holds the address of the employer. 
 */

export class Address
{
    private address: string;

    constructor(address: string)
    {
        this.address = address;
    }

    public getAddress(): string
    {
        return this.address;
    }
}