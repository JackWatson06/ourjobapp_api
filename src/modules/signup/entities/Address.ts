/**
 * Original Author: Jack Watson
 * Created Date: 7/11/2021
 * Purpose: This value object holds the address of the employer. 
 */

export class Address
{
    private address: string;

    constructor(address: string)
    {
        this.address = address;
    }

    /**
     * Get the address for the current employer
     */
    public getAddress(): string
    {
        return this.address;
    }
}