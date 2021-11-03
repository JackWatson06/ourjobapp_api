/**
 * Original Author: Jack Watson
 * Created Date: 11/2/2021
 * Purpose: This command will send out an email for the matches. We will run the matching algorithm every night at 2 am
 * then send out the results every morning around 9.
 */

import * as BatchRepo from "../repositories/BatchRepository";
import * as BatchMatchRepo from "../repositories/BatchMatchRepository";

import Batch from "../entities/Batch";
import BatchMatch from "../entities/BatchMatch";

/**
 * Execute the matching algorithm in our application. Prepare the matches to later be sent out through a seperate algorithm
 */
export default async function *exec()
{
    
    // Get latest batch
    const mostRecent: Batch = await BatchRepo.getMostRecentBatch();

    // Iterate over the batchmatch. Can't afford to load all in meomry
    const batchMatchIterable: AsyncGenerator<BatchMatch|undefined> = 
        await ( yield BatchMatchRepo.getFromBatchIterable(mostRecent) ); 
    let batchMatch = batchMatchIterable.next();

    while(batchMatch != undefined)
    {
        // Send out email with batch match. First conver to view. Then create email then send!


        batchMatch = batchMatchIterable.next();
    }



}
