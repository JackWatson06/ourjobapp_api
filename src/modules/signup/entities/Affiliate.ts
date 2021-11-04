

/**
 * Original Author: Jack Watson
 * Created Date: 10/16/2021
 * Purpose: An affiliate represents someone who just signed up through out affiliate program. They need to validate their
 * email before proceeding onto the next steps.
 */

// Short for Email Message
import * as EmailMs from "notify/Email";
import { sendEmail } from "notify/Notify";
import * as contract from "../services/contract";

// Value Objects
import Email from "./Email";

import { NewAffiliate } from "../validators/NewAffiliateValidator";

export default class Affiliate
{
    // Name of the affiliate. This will be used during link generation.
    private data: NewAffiliate

    // Email of the affiliate.
    private email: Email;

    // Contract of the affiliate.
    private fileName: string;

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
            const today = new Date();
            const oneYearFromNow = new Date(new Date().setFullYear(today.getFullYear() + 1))

            // Figure out what to do here.
            const contractFile: contract.ContractLocator = await contract.generate<contract.Sharer>("sharer", {
                VAR_EFFECTIVE_DATE   : (today).toLocaleDateString("en-US", {year: 'numeric', month: 'long', day: 'numeric'}),
                VAR_TERMINATION_DATE : (oneYearFromNow).toLocaleDateString("en-US", {year: 'numeric', month: 'long', day: 'numeric'}),
                VAR_PARTNER_NAME     : this.data.name,
                VAR_SHARED_NAME      : this.data.name,
                VAR_SHARED_EMAIL     : this.data.email
            });

            let email: EmailMs.Email = EmailMs.makeEmail(this.email.getEmail(), "Please Verify Your Account!");
            // email = EmailMs.addAttachment(email, this.fileName, "Affilaite Contract");
            email = await EmailMs.addHtml(email, "verification", {
                name: this.data.name,
                link: `${process.env.CLIENT_DOMAIN}/verify/sharer/${this.email.getToken()}` 
            });
            email = await EmailMs.addAttachment(email, contractFile.path, "Sharer Contract");

            await sendEmail(email);
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
