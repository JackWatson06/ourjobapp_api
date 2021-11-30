/**
 * Original Author: Jack Watson
 * Created At: 11/29/2021
 * Purpose: This class holds the authetnication behavior for authenticating someone who is trying to use our system.
 */

export class Proof {

    private secret: string;
    private code: number|undefined;
    private expiredAt: number;

    private verifiedAt: number;
    private verified: boolean;

    constructor(
        secret: string, 
        code: number|undefined, 
        expiredAt: number, 
        verified: boolean)
    {
        this.secret     = secret;
        this.code       = code;
        this.expiredAt  = expiredAt;
        this.verifiedAt = 0;
        this.verified   = verified;
    }

    /**
     * Prove that the form data submitted tot his application should be used in the application.
     * @param secret The secret that we must check
     * @param code The code that we may have on sms verification
     */
    public prove(secret: string, code ?: number)
    {
        this.verified = !this.verified && Date.now() < this.expiredAt && this.secret === secret && this.code === code;
        this.verifiedAt = Date.now();

        return this.verified;
    }

    // === Getters ===
    public getVerified(): boolean
    {
        return this.verified
    }

    public getVerifiedAt(): number
    {
        return this.verifiedAt;
    }
}
