/**
 * Original Author: Jack Watson
 * Created Date: 10/24/2021
 * Purpose: This class could be split into a NewToken, and ExistingToken but those are two different states that a token can
 * be in. I decided to just go for the static constructor to house these tokens as I think that simplifies the architecture.
 * 
 * @todo We don't need to generate the code on emails. It would be unecessary here.
 */
import crypto from "crypto";

export default class Token {

    // Hold the date for when we send the verification email.
    private expiredDate: number;

    // Hold the verification token we have generated to verify this emaill.
    private token: string;

    // Additional code we can use if we are validating through sms. We still need to generate the UUID
    // so that we prevent collision on the code.
    private code: string;

    public async generate() {
        
        this.token = crypto.randomUUID();
        this.expiredDate = Date.now() + (3_600_000); // That is 1 hour in milliseconds
    }

    // === GETTERS ===
    public getCode(): string
    {
        return this.code;
    }

    public getToken(): string
    {
        return this.token;
    }

    public getExpiredDate(): number
    {
        return this.expiredDate;
    }
} 