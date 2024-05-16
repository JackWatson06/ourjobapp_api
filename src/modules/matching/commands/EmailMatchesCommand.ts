/**
 * This command will send out an email for the matches. We will run the matching algorithm every night at 2 am
 * then send out the results every morning around 9.
 */

import { Notification } from "notify/Notification";
import {Email} from "notify/messages/Email";

import fs from "infra/FileSystemAdaptor";

import CachedEmail from "../entities/CachedEmail";
import * as CachedEmailMapper from "../mappers/CachedEmailMapper";

/**
 * Execute the matching algorithm in our application. Prepare the matches to later be sent out through a seperate algorithm
 */
export default async function exec()
{   
    const notify: Notification = new Notification();

    // Get latest batch
    const cachedEmails: Array<CachedEmail> = await CachedEmailMapper.read();
    
    for(const cachedEmail of cachedEmails)
    {       
        // Should probably store this in a mapper technically since we are mapping from a persistance layer.
        const email: string = await fs.read( fs.CACHE, cachedEmail.getEmailToken());
        const parsedEmail = JSON.parse(email) as Email;

        await cachedEmail.send(notify, parsedEmail)
        await fs.remove( fs.CACHE, cachedEmail.getEmailToken() );
    }

    await CachedEmailMapper.update(cachedEmails);
}
