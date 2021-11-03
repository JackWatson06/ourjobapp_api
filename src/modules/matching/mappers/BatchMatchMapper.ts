import * as MongoDb from "infa/MongoDb";
import * as Collections from "Collections";
import { Collection, ObjectId } from "mongodb";

import BatchMatch from "../entities/BatchMatch";
import Match from "../entities/Match";

/**
 * Persist the batch match aggregate root object.
 * @param match Instance of a batchmatch domain object. This will be the aggregate root that we are persisting here.
 */
export async function create(match: BatchMatch): Promise<boolean>
{
    const db: MongoDb.MDb = MongoDb.db();
    const matches: Array<Match> = match.getMatches();


    // Create the employer match.
    const batchMatchRow: Collections.BatchMatch = {
        batch_id    : MongoDb.toObjectId( match.getBatchId() ),
        employer_id : MongoDb.toObjectId( match.getEmployerId() ),
        created_at  : MongoDb.now()
    };

    const batchMatchId: ObjectId = (await db.collection("batch_matches").insertOne(batchMatchRow)).insertedId;


    // Loop through all of the employees that matched with the employer.
    for(const match of matches)
    {
        const matchRow: Collections.Match = {
            batch_match_id : batchMatchId,
            employee_id    : MongoDb.toObjectId( match.getEmployee().id ),
            job_id         : MongoDb.toObjectId( match.getJob().getId() ),
            score          : match.getScore(),
        };   

        await db.collection("matches").insertOne(matchRow);
    }

    return true;
}
