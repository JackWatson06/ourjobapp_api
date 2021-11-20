/**
 * Original Author: Jack Watson
 * Created Date: 11/3/2021
 * Purpose: The candidate email represents the email that we recieve when we are looking for candidates.
 */

import { Email } from "notify/messages/Email";
import { EmailNotification } from "notify/EmailNotification";

import BatchMatch from "./BatchMatch";
import * as BatchMatchView from "../views/BatchMatchView"; // Not a huge fan of using view here but it is what we got.


export default class CandidateEmail
{
    private match: BatchMatch;
    private cacheIdentifier: string;
    private sent: boolean;
    private error: boolean;
    private sentAt: number;

    constructor(batchMatch: BatchMatch)
    {
        this.match        = batchMatch;
        this.cacheIdentifier = "";
        this.sentAt       = 0;
        this.sent         = false;
        this.error        = false;
    }

    /**
     * Render the email with relevent data from the match.
     * @param notify Notification service that we are using.
     */
    public async render(notify: EmailNotification): Promise<Email>
    {
        const binds = BatchMatchView.transform(this.match);
        
        return notify.render({
            address: this.match.getEmployer().email,
            subject: "Your Candidate Pool",
            text: "candidates",
            html: "candidates",
        }, binds);
    }

    /**
     * Immediatly build and send out the candidate email for the employer
     * @param notify Notification service we want to use for sending out this email
     */
    public async send(notify: EmailNotification)
    {
        const binds = BatchMatchView.transform(this.match);
        
        const email: Email = await notify.render({
            address: this.match.getEmployer().email,
            subject: "Your Candidate Pool",
            text: "candidates",
            html: "candidates",
        }, binds);

        // Send the notification email. If we fail then mark that as an error.
        if(await notify.send(email))
        {
            this.sentAt = Date.now();
            this.sent = true;
            this.error = false;
        }
        else
        {
            this.error = true;
        }
    }

    /**
     * Set the cache identifier so that we can at a later date retrieve this entity from the cache.
     * @param token The token that we obtained from the cache while we were persiting this candidate email... maybe this happens in the persistance layer.
     */
    public setCacheIdentifier(token: string)
    {
        this.cacheIdentifier = token;
    }

    // === GETTERS ===
    public getCacheIdentifier(): string
    {
        return this.cacheIdentifier;
    }

    public getMatch(): BatchMatch
    {
        return this.match;
    }

    public getSentAt(): number|undefined
    {
        return this.sentAt;
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
