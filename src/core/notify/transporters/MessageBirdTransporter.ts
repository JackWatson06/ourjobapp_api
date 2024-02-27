import messagebird, { MessageBird } from "messagebird";

import * as env from "environment"; // This just sets the types for the environment variables
import { Text } from "../messages/Text";

const messageBirdSdk: MessageBird = messagebird(process.env.SMS_SECRET);
const originator: string = process.env.SMS_NUMBER;
const environment: string = process.env.NODE_ENV;

/**
 * Send out en email using the current settings.
 * @param email Email we are sending (create thee email form the Notify folder)
 */
export async function sendText(text: Text)
{   
    return new Promise<void>((resolve, reject) => {
        // Send a new request to the message bird sdk
        const params = {
            'originator': originator,
            'recipients': [
                text.phone
            ],
            'body': text.text
        };
  
        // Create a new message in the message bird sdk
        messageBirdSdk.messages.create(params, function (err, response) {
            if (err) {
                console.error(err);
                return reject(err);
            }

            if(environment === 'development') {
                console.log(response);
            }

            resolve();
        });
    });
}