/**
 * Original Author: Jack Watson
 * Created Date: 10/24/2021
 * Purpose: This class could be split into a NewToken, and ExistingToken but those are two different states that a token can
 * be in. I decided to just go for the static constructor to house these tokens as I think that simplifies the architecture.
 * 
 * @todo We don't need to generate the code on emails. It would be unecessary here.
 */
import crypto from "crypto";

import Token from "./Token";

export default class PhoneToken {

    private token: Token

    // Additional code we can use if we are validating through sms. We still need to generate the UUID
    // so that we prevent collision on the code.
    private code: string;

    public async generate() {
        
        this.token = new Token();
        this.token.generate();

        this.code = await new Promise((resolve) => {
            crypto.randomBytes(3, function(err, buffer) {
                resolve( parseInt(buffer.toString('hex'), 16).toString().substr(0,6) );
            });
        });
    }

    // === GETTERS ===
    public getCode(): string
    {
        return this.code;
    }

    public getToken(): Token
    {
        return this.token;
    }
} 