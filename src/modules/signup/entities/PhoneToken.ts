/**
 * Original Author: Jack Watson
 * Created Date: 10/24/2021
 * Purpose: This class could be split into a NewToken, and ExistingToken but those are two different states that a token can
 * be in. I decided to just go for the static constructor to house these tokens as I think that simplifies the architecture.
 */
import crypto from "crypto";

export default class Token {

    // Hold the date for when we send the verification email.
    private expiredDate: number;

    // Hold the verification token we have generated to verify this emaill.
    private token: string;

    constructor(token: string, expiredDate: number)
    {
        this.token = token;
        this.expiredDate = expiredDate;
    }

    public static generate() {
        
        const token: string = crypto.randomUUID();
        const expiredDate: number = Date.now() + (86_400_000);

        return new Token(token, expiredDate);
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