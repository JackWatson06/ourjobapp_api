
/**
 * Original Author: Jack Watson
 * Created Date: 10/21/2021
 * Purpose: We need to be able to create new employees. We just need to make sure there email is verified before we put
 * them into the mix of potential candidates. We also may want to do stuff here if we start having problems with spam. 
 * Inside the controller we can split off the 'data' into specific value objects that would allow us to do reasoning validation.
 * "Reasoning Validation" is a word I came up for in order to validate the input meets expected values. Reduces spam.
 */
import {EmailNotification} from "notify/EmailNotification";
import {Email} from "notify/messages/Email";
import * as contract from "../services/contract";

import Address from "./Address";
import Proof from "./Proof";
import Token from "./Token";

import {NewEmployer} from "../validators/NewEmployerValidator";

export default class Employer
{
    private data: NewEmployer;
    private address: Address;
    private token: Token;
    private contract: string;
    private verified_at: number;
    private id: string;

    constructor(data: NewEmployer, address: Address)
    {
        this.data     = data;
        this.address  = address;
    }

    /**
     * Verify the affiliate is who they say they are.
     * true = Was able to send out the email
     * false = Was not able to send out the email
     */
    public async verify(notify: EmailNotification) : Promise<boolean>
    {
        // === TOKEN ===
        this.token = new Token();
        this.token.generate();

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


        // === SEND ===
        const email: Email = await notify.render({
            address : this.data.email,
            subject : "Get Your Link!",
            text    : "employer-verification",
            html    : "employer-verification"
        }, { code: this.token.getCode()} );

        return await notify.send(email);
    }

    public authorize(proof: Proof)
    {
        if( Date.now() < proof.getExpiredDate() )
        {   
            this.verified_at = Date.now();
            return true;
        }

        return false;
    }

    /**
     * Set the id for the employer. This is awful btw.
     * @param id Id is optional
     */
    public setId(id: string)
    {
        this.id = id;
    }

    /**
     * Return the date that we were verified at.
     */
    public getVerifiedOn() : number
    {
        return this.verified_at;
    }

    /**
     * Return the current token for the employer
     */
    public getToken() : Token
    {
        return this.token;
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

    /**
     * Get the identifier for the employer. This is awful btw.
     */
    public getId(): string
    {
        return this.id;
    }
}
