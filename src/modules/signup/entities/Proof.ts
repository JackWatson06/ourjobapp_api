
/**
 * Original Author: Jack Watson
 * Created At: 10/22/2021
 * Purpose: We need a simply data object to communicate with us that we were able to find the verification token in the 
 * database.
 */

export default class Proof
{    
    private id: string;

    constructor(id: string)
    {
        this.id = id;
    }

    public getId()
    {
        return this.id;
    }
}