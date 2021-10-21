

/**
 * Original Author: Jack Watson
 * Created Date: 10/16/2021
 * Purpose: An affiliate represents someone who just signed up through out affiliate program. They need to validate their
 * email before proceeding onto the next steps.
 */

// Value objects
import UnverifiedEmail from "./UnverifiedEmail";

export default class Affiliate
{
    // Name of the affiliate. This will be used during link generation.
    private name: string;

    // Link to the contract that they have signed internally.
    private charity_id: string;

    // Email of the affiliate.
    private unverifiedEmail: UnverifiedEmail;

    constructor(name: string, charity_id: string, unverifiedEmail: UnverifiedEmail )
    {
        this.name = name;
        this.charity_id = charity_id;
        this.unverifiedEmail = unverifiedEmail;
    }

    /**
     * Verify the affiliate is who they say they are.
     */
    public async verify()
    {
        return this.unverifiedEmail.sendVerificationEmail({
            name: this.name
        });
    }

    // === GETTERS ===
    public getName() : string
    {
        return this.name;
    }

    public getCharityId() : string
    {
        return this.charity_id;
    }
    
    public getVerification() : UnverifiedEmail
    {
        return this.unverifiedEmail;
    }
}
