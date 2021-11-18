import * as nodemailer  from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

import * as env from "environment"; // This just sets the types for the environment variables
import { Email } from "../messages/Email";


const from: string     = process.env.MAIL_FROM_ADDRESS
const fromName: string = process.env.MAIL_FROM_NAME

const mailerOptions: SMTPTransport.Options = {
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD
    }
};

const transporter = nodemailer.createTransport(mailerOptions);

/**
 * Send out en email using the current settings.
 * @param email Email we are sending (create thee email form the Notify folder)
 */
export async function send(email: Email)
{   
  // send mail with defined transport object
  return await transporter.sendMail({
    from        : `"${fromName}" <${from}>`,
    to          : email.address,
    subject     : email.subject,
    html        : email.html,
    attachments : email.attachments
  });
}