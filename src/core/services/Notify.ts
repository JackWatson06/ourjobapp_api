/**
 * Original Author: Jack Watson
 * Created Date: 10/16/2021
 * Purpose: This class serves to provide a base to send out notifications to our clients. This can be verification emails, 
 * app emails, or just general marketing emails.
 */

import Handlebars       from "handlebars";
import path             from "path";
import fs               from "fs";
import * as nodemailer  from "nodemailer";

import * as env         from "environment";

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

// async..await is not allowed in global scope, must use a wrapper
export async function email(to: string, subject: string, template: string, binds: {}) 
{
  const templateFile = path.join(__dirname, `../../../templates/email/${template}.hbs`);

  const compiled = await Handlebars.compile( fs.readFileSync(templateFile, 'utf8') );

  // send mail with defined transport object
  return await transporter.sendMail({
    from: `"${fromName}" <${from}>`,
    to: to,
    subject: subject,
    html: compiled(binds),
  });
  
}