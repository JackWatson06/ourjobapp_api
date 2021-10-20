

/**
 * Original Author: Jack Watson
 * Created Date: 10/16/2021
 * Purpose: An affiliate represents someone who just signed up through out affiliate program. They need to validate their
 * email before proceeding onto the next steps.
 */

// Value objects
import Verification from "./Verification";

export default class Affiliate
{
    // Name of the affiliate. This will be used during link generation.
    private name: string;

    // Link to the contract that they have signed internally.
    private charity_id: string;

    // Email of the affiliate.
    private verification: Verification;

    constructor(name: string, charity_id: string, verification: Verification )
    {
        this.name = name;
        this.charity_id = charity_id;
        this.verification = verification;
    }

    /**
     * Verify the affiliate is who they say they are.
     */
    public async verify()
    {
        return this.verification.sendVerificationEmail({
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
    
    public getVerification() : Verification
    {
        return this.verification;
    }
}
