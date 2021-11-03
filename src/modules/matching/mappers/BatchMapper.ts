/**
 * Original Author: Jack Watson
 * Created Date: 11/2/2021
 * Purpose: This file maps the current in memory batch entity to the persistance of the batch entity wherever (currently
 * MongoDb)
 */
import * as MongoDb from "infa/MongoDb";
import * as Collections from "Collections";

import Batch from "../entities/Batch";
import { SortDirection } from "mongodb";

// So I have a question how am I supposed to implement the read method on a mapper. Right here we are expsoing the fact
// that we are using MongoDb is that fine? Should I use something like LINQ probably. But the repos are right on the border
// of the domain layer and persistence. So I belive it is fine to expose this behavior to a repository who needs this 
// behavior becomes wierd though when we use this outside a repo since at that point in time we are exposing the inetranl
// databases method of querying. Its that or custom domain methods for the action we are looking to achieve which I dont
// think this classes job is to expose that.... I have no fucking clue though.
type Filter = {
    _id?: string
};

type Sort = [ string, SortDirection ][]


/**
 * Read the batches. We can also pass in here optional filters, and sorting based on the MonogDB columns.
 */
export async function read(filter: Filter, sort: Sort): Promise<Batch>
{
    const db: MongoDb.MDb = MongoDb.db();
    const batchRow: Collections.Batch|null = await db.collection("batches").find<Collections.Batch>(filter).sort(sort).limit(1).next();
    
    if(batchRow != null)
    {
        return new Batch(batchRow._id.toString());

    }

    throw "No batches found in the database.";
}

/**
 * Create a new batch in the database. The batch represents an aggregate root with the matches that are currently being
 * ran.
 */
export async function create(batch: Batch): Promise<boolean>
{
    const db: MongoDb.MDb = MongoDb.db();

    const batchRow: Collections.Batch = {
        _id        : MongoDb.toObjectId( batch.getId() ),
        created_at : MongoDb.now()
    };

    return ( await db.collection("batches").insertOne(batchRow) ).acknowledged;
}