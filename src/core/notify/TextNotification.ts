/**
 * Original Author: Jack Watson
 * Created Date: 11/17/2021
 * Purpose: The text notification simply controls sending out text messages to whatever data we inserted into the functions.
 * You will seen below it's dependency on the select transporter that we have chosen.
 */

// External Dependencies
import fs from "infa/FileSystemAdaptor";
import Handlebars from "handlebars";

// Internal dependencies
import {NotificationI} from "./NotificationI";
import {Text} from "./messages/Text";
import {send} from "./transporters/MessageBirdTransporter";

class TextNotification implements NotificationI<Text>
{
    async send(text: Text): Promise<boolean>
    {
        try
        {
            await send(text);
            return true;
        }
        catch(e)
        {
            return false;
        }
    }

    /**
     * Render a new text message. We will send this rendered version above. Technically you can skip this step if you
     * don't want to render anything.
     * @param text Text message we are going to swap the text template for.
     * @param binds Binds we are add to the text message template
     */
    async render(text: Text, binds: {}): Promise<Text> 
    {
        const renderedText: Text = { ...text };

        const textTemplate: string = await fs.read(fs.TEMPLATE, `text/${renderedText.text}.hbs`);
        const textRenderer: HandlebarsTemplateDelegate<any> = Handlebars.compile(textTemplate);

        renderedText.text = textRenderer(binds);

        return renderedText;
    }
}

export {TextNotification};
