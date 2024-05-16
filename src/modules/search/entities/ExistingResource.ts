/**
 * This entity purly exists just so that we can check to see if an affiliate link has already been created.
 */

export default class ExistingResource
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
