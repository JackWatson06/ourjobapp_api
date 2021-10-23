
/**
 * Original Author: Jack Watson
 * Created Date: 10/21/2021
 * Purpose: We need to be able to create new employees. We just need to make sure there email is verified before we put
 * them into the mix of potential candidates. We also may want to do stuff here if we start having problems with spam. 
 * Inside the controller we can split off the 'data' into specific value objects that would allow us to do reasoning validation.
 * "Reasoning Validation" is a word I came up for in order to validate the input meets expected values. Reduces spam.
 */

import { NewEmployee } from "../validators/NewEmployeeValidator";
import UnverifiedEmail from "./UnverifiedEmail";

export default class Employee
{
    // The new employee data.
    private data: NewEmployee;

    // Email verification data.
    private email: UnverifiedEmail;

    constructor(data: NewEmployee, email: UnverifiedEmail)
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
     * Get the employees data. We are just storing it generally here just simply due to the sheer amount of parameters.
     * It's not a sparse matrix though so we don't have to use a EAV. I tend to jump to EAV way to quickly.
     */
    public getData(): NewEmployee
    {
        return this.data;
    }
}
