
/**
 * Original Author: Jack Watson
 * Created Date: 10/16/2021
 * Purpose: An email represents a value object in our domain since multiple aggregate roots need an email associated with them
 * we are using this as an abstracted verison of string designed to hole emails.
 */
import Token from "./Token";

export default class Email
{
    // Hold the meail we are verifiying.
    private email: string;

    // Token which houses the verification token that we sent out.
    private token: Token;

    constructor(email: string, token: Token)
    {
        this.email = email;
        this.token = token;
    }

    // === Getters ====
    
    // Get verification 
    public getEmail(): string
    {
        return this.email;
    }

    /**
     * Get the token for this email in order to verify the email.
     */
    public getToken() : string
    {
        return this.token.getToken();
    }

    /**
     * Get the token for this email in order to verify the email.
     */
    public getExpiredDate() : number
    {
        return this.token.getExpiredDate();
    }
}
