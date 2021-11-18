

/**
 * Original Author: Jack Watson
 * Created Date: 10/16/2021
 * Purpose: An affiliate represents someone who just signed up through out affiliate program. They need to validate their
 * email before proceeding onto the next steps.
 * 
 * @todo Remove the contract from this class.
 */

// Short for Email Message
import {TextNotification} from "notify/TextNotification";
import {Text} from "notify/messages/Text";

import * as contract from "../services/contract";

import PhoneToken from "./PhoneToken";
import Proof from "./Proof";
import {NewAffiliate} from "../validators/NewAffiliateValidator";

export default class Affiliate
{
    private data: NewAffiliate;
    private token: PhoneToken;
    private contract: string;
    private verified_on: number;

    constructor(data: NewAffiliate )
    { 
        this.data = data;
    }

    /**
     * Verify the affiliate is who they say they are.
     * true = Was able to send out the email
     * false = Was not able to send out the email
     */
    public async verify(notify: TextNotification) : Promise<boolean>
    {   
        // === TOKEN ===
        this.token = new PhoneToken();
        this.token.generate();

        // === CONTRACT ===
        const today = new Date();
        const oneYearFromNow = new Date(new Date().setFullYear(today.getFullYear() + 1));
        
        // Figure out what to do here.
        // This can be abstracted out into a different entity.
        const contractFile: contract.ContractLocator = await contract.generate<contract.Sharer>("sharer", {
            VAR_EFFECTIVE_DATE   : (today).toLocaleDateString("en-US", {year: 'numeric', month: 'long', day: 'numeric'}),
            VAR_TERMINATION_DATE : (oneYearFromNow).toLocaleDateString("en-US", {year: 'numeric', month: 'long', day: 'numeric'}),
            VAR_PARTNER_NAME     : this.data.name,
            VAR_SHARED_NAME      : this.data.name,
            VAR_SHARED_PHONE     : this.data.phone
        });
        this.contract = contractFile.name;
        
        // === SEND ===
        const text: Text = await notify.render({
            phone: this.data.phone,
            subject: "Get Your Link!",
            text: "affiliate-verification"
        }, { code: this.token.getCode()} );

        return await notify.send(text);
    }

    /**
     * Authorize the affilite to operate. Confirm the expired date is not bad.
     */
    public authorize(proof: Proof)
    {
        if( Date.now() < proof.getExpiredDate() )
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
    
    public getToken() : PhoneToken
    {
        return this.token;
    }

    public getContract() : string
    {   
        return this.contract;
    }
}
