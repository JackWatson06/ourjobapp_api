/**
 * Original Author: Jack Watson
 * Created Date: 11/17/2021
 * Purpose: The email notification allows us to send out any form of email to the email address that we pass.
 */

import Handlebars from "handlebars";
import fs         from "infa/FileSystemAdaptor";

import {NotificationI} from "./NotificationI";
import {send} from "./transporters/NodeMailerTransporter";
import {Email} from "./messages/Email";

class EmailNotification implements NotificationI<Email>
{
    async send(email: Email): Promise<boolean> 
    {
        try {
            await send(email);
            return true;
        }
        catch(e){
            console.error(e);
            return false;
        }
    }

    /**
     * This class will turn certian parameters from just the name of the template to the fully binded HTML, or plain text
     * version of the message.
     * @param email Email we are looking to render out the results
     * @param binds The binds that we are loading into the email
     */
    async render(email: Email, binds: {}): Promise<Email> 
    {
        const renderedEmail: Email = { ...email };

        if(renderedEmail.html != undefined)
        {
            const htmlTemplate: string = await fs.read( fs.TEMPLATE, `email/${renderedEmail.html}.hbs`);
            const htmlRenderer: HandlebarsTemplateDelegate<any> = Handlebars.compile(htmlTemplate);

            renderedEmail.html = htmlRenderer(binds);
        }

        const textTemplate: string = await fs.read(fs.TEMPLATE, `text/${renderedEmail.text}.hbs`);
        const textRenderer: HandlebarsTemplateDelegate<any> = Handlebars.compile(textTemplate);

        renderedEmail.text = textRenderer(binds);

        return renderedEmail;
    }

}

export {EmailNotification};