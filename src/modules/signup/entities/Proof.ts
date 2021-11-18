
/**
 * Original Author: Jack Watson
 * Created At: 10/22/2021
 * Purpose: We need a simply data object to communicate with us that we were able to find the verification token in the 
 * database.
 */

export default class Proof
{    
    //The identifier for the resource this proof represents.
    private id: string;

    //Hold the expired date for this proof
    private expiredDate: number;

    constructor(id: string, expiredDate: number)
    {
        this.id = id;
        this.expiredDate = expiredDate;
    }

    // === GETTERS ===
    public getId()
    {
        return this.id;
    }

    public getExpiredDate()
    {
        return this.expiredDate;
    }
}