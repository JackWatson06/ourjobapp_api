
/**
 * Original Author: Jack Watson
 * Created Date: 10/21/2021
 * Purpose: We need to be able to create new employees. We just need to make sure there email is verified before we put
 * them into the mix of potential candidates. We also may want to do stuff here if we start having problems with spam. 
 * Inside the controller we can split off the 'data' into specific value objects that would allow us to do reasoning validation.
 * "Reasoning Validation" is a word I came up for in order to validate the input meets expected values. Reduces spam.
 */

import * as EmailMs from "notify/Email";
import { sendEmail } from "notify/Notify";
import * as contract from "../services/contract";

import Email from "./Email";
import Address from "./Address";

import { NewEmployer } from "../validators/NewEmployerValidator";

export default class Employer
{
    // The new employee data.
    private data: NewEmployer;

    // Email verification data.
    private email: Email;

    // Address data for the employer.
    private address: Address;

    // File path for the contract in the system.
    private contract: string;

    // Email verification data.
    private verified_at: number;

    constructor(data: NewEmployer, email: Email, address: Address)
    {
        this.data     = data;
        this.email    = email;
        this.address  = address;
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
            // === CONTRACT ===
            const today = new Date();

            // Figure out what to do here.
            // This can be abstracted out into a different entity.
            const contractFile: contract.ContractLocator = await contract.generate<contract.Placement>("placement", {
                VAR_DATE_OF_AGREEMENT      : (today).toLocaleDateString("en-US", {year: 'numeric', month: 'long', day: 'numeric'}),
                VAR_PARTNER_COMPANY_NAME   : this.data.company_name,
                VAR_PARTNER_OFFICE_ADDRESS : this.address.getAddress(),
                VAR_DESIGNATED_PARTY_NAME  : `${this.data.fname} ${this.data.lname}`,
                VAR_DESIGNATED_PARTY_EMAIL : this.data.email
            });
            this.contract = contractFile.name;


            // === EMAIL ===
            let email: EmailMs.Email = EmailMs.makeEmail(this.email.getEmail(), "Start Receiving Candidates!");
            email = await EmailMs.addHtml(email, "employer-verification", {
                name: this.data.fname + " " + this.data.lname,
                link: `${process.env.CLIENT_DOMAIN}/verify/employer/${this.email.getToken()}`
            });
            email = EmailMs.addAttachment(email, contractFile.path, "Employer Contract");

            await sendEmail(email);
            
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

    /**
     * Return the date that we were verified at.
     */
    public getVerifiedOn() : number
    {
        return this.verified_at;
    }

    /**
     * Get the employees email.
     */
    public getEmail() : Email
    {
        return this.email;
    }

    /**
     * Get the employers data.
     */
    public getData(): NewEmployer
    {
        return this.data;
    }

    /**
     * Get the employers contract when the sign it.
     */
    public getContract() : string
    {
        return this.contract;
    }
}
