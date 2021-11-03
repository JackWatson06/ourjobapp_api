/**
 * Original Author: Jack Watson
 * Created Date: 11/2/2021
 * Purpose: This class acts as a interface for the collection of a BatchMatch domain entity. In this case we have a simple function
 * for reading in the entity and we return a iterable instance so that we are not loading everything at once but rather pulling
 * them out of the database when we need to. This will save memory.
 */

import * as BatchMatchMapper from "../mappers/BatchMatchMapper";

import BatchMatch from "../entities/BatchMatch";
import Batch from "../entities/Batch";

/**
 * Get an interable function so that we do not load all of the resources at ounce but rather load them iteratively from
 * whatever persistence backend we are using.
 * @param batch The batch that we are looping through all of the matches for.
 */
export async function *getFromBatchIterable(batch: Batch)
{
    const batchMatchIterable: AsyncGenerator<BatchMatch|undefined> = BatchMatchMapper.readBulk({ batch_id: batch.getId() });
    let batchMatch: BatchMatch|undefined = await (yield batchMatchIterable.next());

    while(batchMatch != undefined) {
        yield batchMatch;
    }
}



