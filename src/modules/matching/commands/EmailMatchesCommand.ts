/**
 * Original Author: Jack Watson
 * Created Date: 11/2/2021
 * Purpose: This command will send out an email for the matches. We will run the matching algorithm every night at 2 am
 * then send out the results every morning around 9.
 */


import * as CachedEmailMapper from "../mappers/CachedEmailMapper";

import CachedEmail from "../entities/CachedEmail";

/**
 * Execute the matching algorithm in our application. Prepare the matches to later be sent out through a seperate algorithm
 */
export default async function exec()
{   
    // Get latest batch
    const cachedEmails: Array<CachedEmail> = await CachedEmailMapper.read();
    
    for(const email of cachedEmails)
    {       
        await email.send();
    }

    await CachedEmailMapper.update(cachedEmails);
}
