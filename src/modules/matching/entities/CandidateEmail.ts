/**
 * Original Author: Jack Watson
 * Created Date: 11/3/2021
 * Purpose: The candidate email represents the email that we recieve when we are looking for candidates.
 */

import { sendFromCache } from "services/Notify";

export default class CandidateEmail
{
    private id: string;
    private emailToken: string;
    private sent: boolean;
    private sent_at: number;
    private error: boolean;


    constructor(id: string, emailToken: string)
    {
        this.id         = id;
        this.emailToken = emailToken;
        this.sent_at    = 0;
        this.sent       = false;
        this.error      = false;
    }

    /**
     * Send the email to the employer. Handle the result in this function.
     */
    public async send(): Promise<boolean>
    {
        try
        {
            await sendFromCache(this.emailToken);
            
            this.sent_at = Date.now();
            this.sent    = true;
        }
        catch(err)
        {
            console.error(err);
            
            this.error = true;
            return false;
        }

        return true;
    }


    // === GETTERS ===
    public getId(): string
    {
        return this.id;
    }

    public getSentAt(): number|undefined
    {
        return this.sent_at;
    }

    public getSent(): boolean
    {
        return this.sent;
    }

    public getError(): boolean
    {
        return this.error;
    }
}
