/**
 * Original Author: Jack Watson
 * Created Date: 11/3/2021
 * Purpose: The candidate email represents the email that we recieve when we are looking for candidates.
 */

import * as EmailMs from "notify/Email";
import { cacheEmail, sendEmail } from "notify/Notify";

import BatchMatch from "./BatchMatch";
import * as BatchMatchView from "../views/BatchMatchView"; // Not a huge fan of using view here but it is what we got.

export default class CandidateEmail
{
    private match: BatchMatch;
    private messageToken: string;
    private sent: boolean;
    private error: boolean;
    private sentAt: number;

    constructor(batchMatch: BatchMatch)
    {
        this.match        = batchMatch;
        this.messageToken = "";
        this.sentAt       = 0;
        this.sent         = false;
        this.error        = false;
    }

    public async cache()
    {
        const binds = BatchMatchView.transform(this.match);
        
        let email: EmailMs.Email = EmailMs.makeEmail(this.match.getEmployer().email, "Your Candidate Pool");
        email = await EmailMs.addHtml(email, "candidates", binds);

        this.messageToken = await cacheEmail(email);
    }

    public async send()
    {
        const binds = BatchMatchView.transform(this.match);
        
        let email: EmailMs.Email = EmailMs.makeEmail(this.match.getEmployer().email, "Your First Candidate Pool!");
        email = await EmailMs.addHtml(email, "candidates", binds);

        try
        {
            await sendEmail(email);
            this.sentAt = Date.now();
            this.sent = true;
            this.error = false;
        }
        catch(error)
        {
            this.error = true;
        }
    }

    // === GETTERS ===
    public getMessageToken(): string
    {
        return this.messageToken;
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
