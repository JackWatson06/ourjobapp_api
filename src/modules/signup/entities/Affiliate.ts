

/**
 * Original Author: Jack Watson
 * Created Date: 10/16/2021
 * Purpose: An affiliate represents someone who just signed up through out affiliate program. They need to validate their
 * email before proceeding onto the next steps.
 */

// Value objects
import { email } from "services/Notify";
import Email from "./Email";

export default class Affiliate
{
    // Name of the affiliate. This will be used during link generation.
    private name: string;

    // Link to the contract that they have signed internally.
    private charity_id: string;

    // Email of the affiliate.
    private email: Email;

    // Link to the contract that they have signed internally.
    private verified_at: number;

    constructor(name: string, charity_id: string, email: Email )
    { 
        this.name        = name;
        this.charity_id  = charity_id;
        this.email       = email;
    }

    /**
     * Verify the affiliate is who they say they are.
     * true = Was able to send out the email
     * false = Was not able to send out the email
     */
    public async verify() : Promise<boolean>
    {

        if( Date.now() < this.email.getExpiredDate() )
        {
            await email(this.email.getEmail(), "Please Verify Your Account!", "verification", {
                name: this.name,
                token: this.email.getToken()
            });

            return true;
        }

        return false;
    }

    public authorize()
    {
        if( Date.now() < this.email.getExpiredDate() )
        {   
            this.verified_at = Date.now();
            return true;
        }

        return false;
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

    public getVerifiedAt() : number
    {
        return this.verified_at;
    }
    
    public getEmail() : Email
    {
        return this.email;
    }
}
