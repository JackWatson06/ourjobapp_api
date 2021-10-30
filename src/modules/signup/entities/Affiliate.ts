

/**
 * Original Author: Jack Watson
 * Created Date: 10/16/2021
 * Purpose: An affiliate represents someone who just signed up through out affiliate program. They need to validate their
 * email before proceeding onto the next steps.
 */

// Value objects
import { email } from "services/Notify";
import { NewAffiliate } from "../validators/NewAffiliateValidator";

import Email from "./Email";

export default class Affiliate
{
    // Name of the affiliate. This will be used during link generation.
    private data: NewAffiliate

    // Email of the affiliate.
    private email: Email;

    // Link to the contract that they have signed internally.
    private verified_on: number;

    constructor(data: NewAffiliate, email: Email )
    { 
        this.data        = data;
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
                name: this.data.name,
                link: `${process.env.CLIENT_DOMAIN}/verify/sharer/${this.email.getToken()}` 
            });
            return true;
        }

        return false;
    }

    /**
     * Authorize the affilite to operate. Confirm the expired date is not bad.
     */
    public authorize()
    {
        if( Date.now() < this.email.getExpiredDate() )
        {   
            this.verified_on = Date.now();
            return true;
        }

        return false;
    }

    // === GETTERS ===
    public getName() : string
    {
        return this.data.name;
    }

    public getData() : NewAffiliate
    {
        return this.data;
    }

    public getVerifiedAt() : number
    {
        return this.verified_on;
    }
    
    public getEmail() : Email
    {
        return this.email;
    }
}
