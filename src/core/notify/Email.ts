/**
 * Original Author: Jack Watson
 * Created Date: 11/1/2021
 * Purpose: This class uses the builder pattern in order to create a new email that we are sending out. This email will
 * have a list of potential attachments as well that we are sending out.
 */
import Handlebars from "handlebars";
import fs         from "infa/FileSystemAdaptor";

// Types that we are defining in this funciton. These should be moved to the /types at some point. They should be a d.ts? Potentially
// I wonder where these types should go for a specific file.
type Attachment = {
    path: string,
    name: string
  }

export type Email = {
    to           : string,
    subject      : string,
    html        ?: string,
    attachments ?: Array<Attachment>
}

/**
 * Make a new email object which will be sent out using the notifer service.n
 * @param from Who the email is from
 * @param to Who the email is going to.
 * @param subject What the email's message is.
 */
export function makeEmail(to: string, subject: string): Email
{
    return {
        to     : to,
        subject: subject
    }
}

/**
 * Add an additional attachment to the email that we are sending out. 
 * @param email Email we are building
 * @param path The file path for the attachment
 * @param name The name of the file we are attaching.
 */
export function addAttachment(email: Email, path: string, name: string): Email
{
    const otherAttachments:Array<Attachment> = email.attachments ?? [];

    return { 
        ...email,
        attachments: [
            ...otherAttachments,
            {
                path: path,
                name: name
            }
        ]
    };
} 

/**
 * Add HTML to the current email that we are building for the notification service.
 * @param email Email we are building
 * @param template The template we want to load
 * @param binds The binds that go into the template.
 */
export async function addHtml(email: Email, template: string, binds: {}): Promise<Email>
{
    const templateFile: string                      = await fs.read( fs.TEMPLATE, `email/${template}.hbs`);
    const compiled: HandlebarsTemplateDelegate<any> = Handlebars.compile(templateFile);

    return { 
        ...email,
        html: compiled(binds) 
    };
}