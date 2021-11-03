
/**
 * Original Author: Jack Watson
 * Created Date: 3/11/2021
 * Purpose: An unsent email represents an email that we still have to send out. This email would be in a state where we
 * are ready to go but still just need to trigger the go button. The template has been generated however.
 */

import Handlebars from "handlebars";
import path       from "path";
import fs         from "fs";

import BatchMatch from "../entities/BatchMatch";
import * as emailView from "../views/BatchMatchView"; // Not a huge fan of using view here but it is what we got.

export default class UnsentEmail
{
    // BatchMatch represents the list of employers who just signedup.
    private match: BatchMatch;

    // Email for this email
    private email: string;

    // Keep a message token with the email so we know which email it is
    private messageToken: string;

    constructor(match: BatchMatch, email: string)
    {
        this.match = match;
        this.email = email;
    }

    async generateEmail(binds: emailView.BatchMatchView)
    {
        const templateFile: string                      = path.join(__dirname, `../templates/candidates.hbs`);
        const compiled: HandlebarsTemplateDelegate<any> = await Handlebars.compile( fs.readFileSync(templateFile, 'utf8') );
    
        compiled(binds)
    }

}
