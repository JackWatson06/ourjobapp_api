/**
 * Original Author: Jack Watson
 * Created Date: 10/16/2021
 * Purpose: This class serves to provide a base to send out notifications to our clients. This can be verification emails, 
 * app emails, or just general marketing emails.
 */

import * as nodemailer  from "nodemailer";
import * as Email from "./Email";

import fs from "infa/FileSystemAdaptor";
import * as env from "environment"; // This just sets the types for the environment variables

const from: string     = process.env.MAIL_FROM_ADDRESS
const fromName: string = process.env.MAIL_FROM_NAME

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: true, 
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD
  },
});


/**
 * Send out en email using the current settings.
 * @param email Email we are sending (create thee email form the Notify folder)
 */
export async function sendEmail(email: Email.Email)
{   
  // send mail with defined transport object
  return await transporter.sendMail({
    from        : `"${fromName}" <${from}>`,
    to          : email.to,
    subject     : email.subject,
    html        : email.html,
    attachments : email.attachments
  });
}

/**
 * Cache the given email so we can send it out later.
 * @param email Email we want to cache
 */
export async function cacheEmail(email: Email.Email): Promise<string>
{
    return await fs.write( fs.CACHE, JSON.stringify(email) );
}

/**
 * Send the email that we have saved in the cache from the mapping process.
 * @param token Token we recieved from the cache
 */
export async function sendFromCache(token: string): Promise<string>
{
    try
    {
        const data = await fs.read( fs.CACHE, token );
        await sendEmail(JSON.parse(data) as Email.Email);
        return "Success";
    }
    catch(err)
    {
        console.error(err);
        return "Error";
    }
    finally
    {
        await fs.remove( fs.CACHE, token );
    }
}
