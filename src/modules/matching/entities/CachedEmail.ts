/**
 * The candidate email represents the email that we recieve when we are looking for candidates.
 */

import {Notification} from "notify/Notification";
import {Email} from "notify/messages/Email";

export default class CacheEmail
{

    // The cached email id
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
    public async send(notify: Notification, email: Email): Promise<boolean>
    {
        if(await notify.email(email))
        {
            this.sent_at = Date.now();
            this.sent    = true;
            return true;
        }
        else
        {
            this.error = true;
            return false;
        }
    }

    public getId(): string
    {
        return this.id;
    }

    public getEmailToken(): string
    {
        return this.emailToken;
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
