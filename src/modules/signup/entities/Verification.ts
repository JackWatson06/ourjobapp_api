
/**
 * Original Author: Jack Watson
 * Created Date: 10/16/2021
 * Purpose: An email represents a value object in our domain since multiple aggregate roots need an email associated with them
 * we are using this as an abstracted verison of string designed to hole emails.
 */
import { email } from "services/Notify";
import crypto from "crypto";

export type VerificationEmail = {
    name: string,
    verificationLink ?: string
}

export default class Verification
{
    // Hold the meail we are verifiying.
    private email: string;

    // Hold the verification token we have generated to verify this emaill.
    private verificationToken: string;

    // Hold the date for when we send the verification email.
    private created_at: number;

    // // Hold the date the email was verified.
    // private verifiedDate: string;

    constructor(email: string)
    {
        this.email = email;
    }

    /**
     * Send out the email in order to verify the person who just signedup to our platform.
     * @param additionalText Additional Text to be supplied with standard verification text.
     */
    public async sendVerificationEmail(binds: {        
        name: string,
        verificationToken ?: string
    })
    {

        this.verificationToken = await new Promise((resolve, reject) => {
            crypto.randomBytes(16, function(err: Error, buffer: Buffer) {
                resolve(buffer.toString('hex'));
            });
        });
        
        binds.verificationToken = this.verificationToken;

        email(this.email, "Please Verify your Account!", "verification", binds);
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
        return this.verificationToken;
    }
}

