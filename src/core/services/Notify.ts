/**
 * Original Author: Jack Watson
 * Created Date: 10/16/2021
 * Purpose: This class serves to provide a base to send out notifications to our clients. This can be verification emails, 
 * app emails, or just general marketing emails.
 */

import * as nodemailer  from "nodemailer";
import * as Email from "./notify/Email";
import path       from "path";
import objectHash from "object-hash";
import fs         from "fs";

import * as env         from "environment"; // This just sets the types for the environment variables

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

export async function cacheEmail(email: Email.Email): Promise<string>
{
    const hash: string  = objectHash.MD5(email);
    const cache: string = path.join(__dirname, `../../../.cache/${hash}`);

    return new Promise((resolve, reject) => {
        fs.writeFile(cache, JSON.stringify(email), { flag: 'a' }, err => {
            if(err)
            {
                reject("");
            }

            resolve(hash);
        });
    })
}

export async function sendFromCache(token: string): Promise<string>
{
    const cache: string = path.join(__dirname, `../../../.cache/${token}`);

    return new Promise((resolve, reject) => {
        fs.readFile(cache, "utf8", async ( err, data) => {
            // If the file with the given token does not exist.
            if(err)
            {
                reject("Invalid email token");
            }

            // Try sending the email out.
            try
            {
                // If we sent email and delete proimse mark return true to singify we send.
                await sendEmail(JSON.parse(data) as Email.Email);
                await fs.promises.unlink(cache);

                resolve("Sent candidate email");
            }
            // If we could not send out an email unlink the read file.
            catch(err)
            {
                await fs.promises.unlink(cache);

                reject("Could not send candidate email");
            }
        });
    })
}
