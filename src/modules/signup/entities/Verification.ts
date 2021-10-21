
/**
 * Original Author: Jack Watson
 * Created Date: 10/20/2021
 * Purpose: The purpose of this class would be to verify incoming resources through the url. If the url is hit by a frontend client
 * it will verify whatever resource matches to that token.
 */

export default class Verification
{
    // Identifier for the verification entity.
    private id: string;

    // Expired date that we currently have for the verification. Need to make sure the current data is not greater than this date
    private expiredDate: number;

    // Hold state on if we become verified or not.
    private verified: boolean;

    // Date we are verified on.
    private verifiedOn: number;

    // Keep track of the resource we are verifiying through email.
    private resource: string;

    // What is the resource id that we are verifiying.
    private resource_id: string;

    // Way to many damn properties.....
    constructor(id: string, expiredDate: number, resource: string, resource_id: string)
    {
        this.id          = id;
        this.expiredDate = expiredDate;
        this.verified    = false;

        this.resource    = resource;
        this.resource_id = resource_id;
    }

    /**
     * Check to see if the verification link has timed out or not.
     */
    public timedOut()
    {
        return Date.now() > this.expiredDate;
    }

    /**
     * Verify the resource is good to go.
     */
    public verify()
    {
        this.verifiedOn = Date.now();
        this.verified   = true;
    }


    // ==== Getters =====
    public getId(): string
    {
        return this.id;
    }

    public getExpiredDate(): number
    {
        return this.expiredDate;
    }

    public getVerified(): boolean
    {
        return this.verified;
    }

    public getVerifiedOn(): number
    {
        return this.verifiedOn;
    }

    public getResource(): string
    {
        return this.resource;
    }

    public getResourceId(): string
    {
        return this.resource_id;
    }
}

