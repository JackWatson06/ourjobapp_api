/**
 * Original Author: Jack Watson
 * Created Date: 11/2/2021
 * Purpose: This file maps the current in memory batch entity to the persistance of the batch entity wherever (currently
 * MongoDb)
 */
import * as MongoDb from "infa/MongoDb";
import * as Collections from "Collections";

import Batch from "../entities/Batch";

/**
 * Create a new batch in the database. The batch represents an aggregate root with the matches that are currently being
 * ran.
 */
export async function create(batch: Batch): Promise<boolean>
{
    const db: MongoDb.MDb = MongoDb.db();

    const batchRow: Collections.Batch = {
        _id: MongoDb.toObjectId( batch.getId() ),
        created_at: MongoDb.now()
    };

    return ( await db.collection("batches").insertOne(batchRow) ).acknowledged;
}
