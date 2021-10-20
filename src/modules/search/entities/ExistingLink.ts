/**
 * Original Author: Jack Watson
 * Created At: 10/16/2021
 * Purpose: I know this entity seems change essential we have the idea of colliding links in our domain. This entity purley
 * exists just so that we can check to see if an affiliate link has already been created.
 */

export default class ExistingLink
{

    private exists: boolean;

    constructor( exists: boolean)
    {
        this.exists = exists;
    }

    public getExists()
    {
        return this.exists;
    }
}
