/**
 * Original Author: Jack Watson
 * Created Date: 11/2/2021
 * Purpose: This file maps the current in memory batch entity to the persistance of the batch entity wherever (currently
 * MongoDb)
 */
import { collections, toObjectId, now } from "db/MongoDb";
import { Schema } from "db/DatabaseSchema";

import Batch from "../entities/Batch";

/**
 * Read the batches. We can also pass in here optional filters, and sorting based on the MonogDB columns.
 */
export async function map(batchRow: Schema.Batch): Promise<Batch>
{
    return new Batch(batchRow._id.toString());
}

/**
 * Create a new batch in the database. The batch represents an aggregate root with the matches that are currently being
 * ran.
 */
export async function create(batch: Batch): Promise<boolean>
{
    return ( await collections.batches.insertOne({
        _id        : toObjectId( batch.getId() ),
        created_at : now()
    }) ).acknowledged;
}