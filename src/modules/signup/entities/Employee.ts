
/**
 * Original Author: Jack Watson
 * Created Date: 10/21/2021
 * Purpose: We need to be able to create new employees. We just need to make sure there email is verified before we put
 * them into the mix of potential candidates. We also may want to do stuff here if we start having problems with spam. 
 * Inside the controller we can split off the 'data' into specific value objects that would allow us to do reasoning validation.
 * "Reasoning Validation" is a word I came up for in order to validate the input meets expected values. Reduces spam.
 */

// Short for Email Message
import {TextNotification} from "notify/TextNotification";
import {Text} from "notify/messages/Text";

import PhoneToken from "./PhoneToken";
import Proof from "./Proof";
import Resume from "./Resume";

import { NewEmployee } from "../validators/NewEmployeeValidator";

export default class Employee
{

    private data: NewEmployee;
    private token: PhoneToken;
    private resume: Resume|undefined;
    private verified_on: number;

    constructor(data: NewEmployee, resume?: Resume)
    {
        this.data   = data;
        this.resume = resume;
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

        // === SEND ===
        const text: Text = await notify.render({
            phone: this.data.phone,
            subject: "Submit Your Application!",
            text: "employee-verification"
        }, { code: this.token.getCode()} );

        return await notify.send(text);
    }

    /**
     * Authorize the employee to be used in the system.
     * @param proof Proof that we need to verify the employee. We grab this from the database
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
    public getResume(): Resume|undefined
    {
        return this.resume;
    }

    public getVerifiedOn(): number
    {
        return this.verified_on
    }

    public getToken() : PhoneToken
    {
        return this.token;
    }

    public getData(): NewEmployee
    {
        return this.data;
    }
}
