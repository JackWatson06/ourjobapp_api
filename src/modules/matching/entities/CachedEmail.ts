
/**
 * Original Author: Jack Watson
 * Created Date: 3/11/2021
 * Purpose: An unsent email represents an email that we still have to send out. This email would be in a state where we
 * are ready to go but still just need to trigger the go button. The template has been generated however.
 */

import * as EmailMs from "notify/Email";
import { cacheEmail } from "notify/Notify";

import BatchMatch from "./BatchMatch";
import * as BatchMatchView from "../views/BatchMatchView"; // Not a huge fan of using view here but it is what we got.

export default class CachedEmail
{
    // Email for this email
    private match: BatchMatch;

    // Keep a message token with the email so we know which email it is
    private messageToken: string;

    constructor(match: BatchMatch)
    {
        this.match = match;
    }

    async generateEmail()
    {
        const binds = BatchMatchView.transform(this.match);
        
        let email: EmailMs.Email = EmailMs.makeEmail(this.match.getEmployer().email, "You have been matched!");
        email = await EmailMs.addHtml(email, "candidates", binds);

        this.messageToken = await cacheEmail(email);
    }

    public getMessageToken(): string
    {
        return this.messageToken;
    }

    public getMatch(): BatchMatch
    {
        return this.match;
    }
}
