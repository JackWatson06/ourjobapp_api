import * as nodemailer  from "nodemailer";
import * as env from "environment"; // This just sets the types for the environment variables

import { Email } from "../messages/Email";

const from: string     = process.env.MAIL_FROM_ADDRESS
const fromName: string = process.env.MAIL_FROM_NAME

const transporter = createTransporter();

/**
 * Depending on the environment we will either want to make a connection to mailhog or SMTP.
 * @returns Node mailer transporter
 */
function createTransporter(): nodemailer.Transporter {
    switch(process.env.NODE_ENV){
        case 'production':
            return nodemailer.createTransport({
                host: process.env.MAIL_HOST,
                port: process.env.MAIL_PORT,
                auth: {
                  user: process.env.MAIL_USERNAME,
                  pass: process.env.MAIL_PASSWORD
                }
            });
        case 'development':
        default:
            return nodemailer.createTransport({
                host: process.env.MAIL_HOST,
                port: process.env.MAIL_PORT
            }); 
    }
            
}

/**
 * Send out en email using the current settings.
 * @param email Email we are sending (create thee email form the Notify folder)
 */
export async function sendEmail(email: Email)
{   
  return await transporter.sendMail({
    from        : `"${fromName}" <${from}>`,
    to          : email.address,
    subject     : email.subject,
    html        : email.html,
    attachments : email.attachments
  });
}