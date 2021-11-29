/**
 * Original Author: Jack Watson
 * Created At: 11/28/2021
 * Purpose: This class holds the idea of a token. A token simple represents a thing given to someone who is trying to authorize
 * into the system through some third party. In our case our token can have a secret, or an optional code. The optional code
 * would symbolize the method in which the user was authenticated by. If they have a code then that would be a phone verification.
 */
import crypto from "crypto";

export class Token{

    private secret     : string;
    private code       : number|undefined;
    private verified   : boolean;
    private expiredAt  : number;

    constructor(
        secret: string         = "", 
        code: number|undefined = undefined,
        expiredAt: number      = 0, 
        verified: boolean      = false)
    { 
        this.secret     = secret;
        this.code       = code;
        this.verified   = verified;
        this.expiredAt  = expiredAt;
    }

    /**
     * Check to see if this token can be regenerated. If we are passed expiration then the user most go through the frontend
     * form again. This would be additionally true when they have been consumed.
     */
    public valid(): boolean
    {
        return !this.verified && Date.now() < this.expiredAt;
    }

    /**
     * Generate a new secret that we can use for this token.
     */
    public generateSecretToken(): void
    {
        this.secret    = crypto.randomUUID();
        this.expiredAt = Date.now() + (3_600_000); // That is 1 hour in milliseconds
    }

    /**
     * Generate a new code that would be attached to this token. This is an async proccess for some unkown reason. Most likely
     * since it takes time to generate pseudo random numbers.
     */
    public async addCode(): Promise<void>
    {
        this.code = await new Promise((resolve) => {
            crypto.randomBytes(3, function(err, buffer) {
                resolve( parseInt( parseInt(buffer.toString('hex'), 16).toString().substr(0,6)) );
            });
        });
    }

    // === GETTERS ===    
    public getSecret(): string
    {
        return this.secret;
    }

    public getCode(): number|undefined
    {
        return this.code;
    }

    public getExpiredAt(): number
    {
        return this.expiredAt;
    }

    public getVerified(): boolean
    {
        return this.verified;
    }
}

