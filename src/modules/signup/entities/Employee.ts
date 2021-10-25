
/**
 * Original Author: Jack Watson
 * Created Date: 10/21/2021
 * Purpose: We need to be able to create new employees. We just need to make sure there email is verified before we put
 * them into the mix of potential candidates. We also may want to do stuff here if we start having problems with spam. 
 * Inside the controller we can split off the 'data' into specific value objects that would allow us to do reasoning validation.
 * "Reasoning Validation" is a word I came up for in order to validate the input meets expected values. Reduces spam.
 */

import { NewEmployee } from "../validators/NewEmployeeValidator";
import { email } from "services/Notify";

import Email from "./Email";

export default class Employee
{
    // The new employee data.
    private data: NewEmployee;

    // Email verification data.
    private email: Email;

    // Date verified
    private verified_on: number;

    constructor(data: NewEmployee, email: Email)
    {
        this.data  = data;
        this.email = email;
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
                name: this.data.fname + " " + this.data.lname,
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
            this.verified_on = Date.now();
            return true;
        }

        return false;
    }

    /**
     * Return verified at number which represents when the email for a employee was verified at.
     */
    public getVerifiedOn(): number
    {
        return this.verified_on
    }

    /**
     * Get the employees email.
     */
    public getEmail() : Email
    {
        return this.email;
    }

    /**
     * Get the employees data. We are just storing it generally here just simply due to the sheer amount of parameters.
     * It's not a sparse matrix though so we don't have to use a EAV. I tend to jump to EAV way to quickly.
     */
    public getData(): NewEmployee
    {
        return this.data;
    }
}
