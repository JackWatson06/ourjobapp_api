
/**
 * Original Author: Jack Watson
 * Created Date: 10/21/2021
 * Purpose: We need to be able to create new employees. We just need to make sure there email is verified before we put
 * them into the mix of potential candidates. We also may want to do stuff here if we start having problems with spam. 
 * Inside the controller we can split off the 'data' into specific value objects that would allow us to do reasoning validation.
 * "Reasoning Validation" is a word I came up for in order to validate the input meets expected values. Reduces spam.
 */

import { NewEmployer } from "../validators/NewEmployerValidator";
import UnverifiedEmail from "./UnverifiedEmail";

export default class Employer
{
    // The new employee data.
    private data: NewEmployer;

    // Email verification data.
    private email: UnverifiedEmail;

    constructor(data: NewEmployer, email: UnverifiedEmail)
    {
        this.data  = data;
        this.email = email;
    }

    /**
     * Send a verification link for the employee that just signed up.
     */
    public async verify()
    {
        return this.email.sendVerificationEmail({
            name: this.data.fname + " " + this.data.lname
        });
    }

    /**
     * Get the employees email.
     */
    public getEmail() : UnverifiedEmail
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
}
