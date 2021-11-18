/**
 * Original Author: Jack Watson
 * Created Date: 11/17/2021
 * Purpose: This class runs a few tests which will make sure that our notification service is fully functional.
 * 
 * @todo we will probably want to mock the template engine, and the filesystem here. Technically these are not unit tests.
 */

import {EmailNotification} from "notify/EmailNotification";
import {TextNotification} from "notify/TextNotification";
import {Email} from "notify/messages/Email";
import {Text} from "notify/messages/Text";

test('we can render HTML on the message', async () => {
   
    // === Setup ===
    const notificationEmail = new EmailNotification();
    const newEmail: Email = {
        address: "j.watson@americanlaborcompany.com",
        subject: "Verify Your Account",
        text: "employer-verification",
        html: "employer-verification",
    };

    // === Execute ===
    const email: Email = await notificationEmail.render(newEmail, {
        name: "Jack Watson",
        link: "https://testing.com"
    });

    // === Assert ===
    if(email.html != undefined)
    {
        expect(/Hi, Jack Watson!/.test(email.html)).toBe(true);
    }

    expect(/Hi, Jack Watson!/.test(email.text)).toBe(true);
});

test('we can render text on the message', async () => {
    // === Setup ===
    const notificationText = new TextNotification();
    const newText: Text = {
        phone: "111-111-1111",
        subject: "Verify Your Account",
        text: "affiliate-verification"
    };

    // === Execute ===
    const text: Text = await notificationText.render(newText, {
        code: "000000"
    });
    
    // === Assert ===
    expect(/000000 is your OurJob\.App verification code!/.test(text.text)).toBe(true);
});
