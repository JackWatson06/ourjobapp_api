
/**
 * Original Author: Jack Watson
 * Created Date: 11/26/2021
 * Purpose: This class serves to execute notifications against our current implementations of the notification services.
 */

import { Email } from "./messages/Email";
import { Text } from "./messages/Text";
import { INotification } from "./INotification";

import { sendEmail } from "./transporters/NodeMailerTransporter";
import { sendText } from "./transporters/MessageBirdTransporter";


export class Notification implements INotification{

    /**
     * Send an email through our given email client.
     * @param email Email message we are trying to send.
     */
    public async email(email: Email): Promise<boolean>
    {
        try {
            await sendEmail(email);
            return true;
        }
        catch(e){
            console.error(e);
            return false;
        }
    }

    /**
     * Seend a text message through the SMS service that we have chosen.
     * @param text Text message we are sending.
     */
    public async text(text: Text): Promise<boolean>
    {
        try
        {
            await sendText(text);
            return true;
        }
        catch(e)
        {
            console.error(e);
            return false;
        }
    }
}
