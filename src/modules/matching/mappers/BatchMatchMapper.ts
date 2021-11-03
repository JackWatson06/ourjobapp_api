import * as MongoDb from "infa/MongoDb";
import * as Collections from "Collections";
import { Collection, ObjectId } from "mongodb";

import BatchMatch from "../entities/BatchMatch";
import Match from "../entities/Match";

type Filter = {
    batch_id ?: string
}

/**
 * Read in bulk from the mongodb. This will use a generator function in order to read in the data. 
 * @param filter Filter we are allowed to use for bulk read
 */
export async function *readBulk(filter: Filter)
{    
    const db: MongoDb.MDb  = MongoDb.db();
    const batchMatchCursor = db.collection("batch_matches").find<Collections.BatchMatch>(filter);

    while(await batchMatchCursor.hasNext()) {
        const batchMatchRow: Collections.BatchMatch|null = await batchMatchCursor.next();

        // Skip if we don't have the batch match.
        if(batchMatchRow === null)
        {
            yield undefined;
            continue;
        }

        // Get the query that we are going to use to pull out the matches.
        const matchQuery = {
            match_id: batchMatchRow._id
        }

        // Create a new batch match memory with the current state.
        const batchMatch = new BatchMatch(
            batchMatchRow.batch_id?.toString() ?? "", 
            batchMatchRow.employer_id.toString()
        );

        // Add the matches to the batch match.
        await db.collection("matches").find<Collections.Match>(matchQuery).forEach( (match: Collections.Match) => {
            batchMatch.integrateMatch( new Match(match.employee_id.toString(), match.score, match.job_id.toString()) );
        } );

        yield batchMatch;
    }
}


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
            employee_id    : MongoDb.toObjectId( match.getEmployee() ),
            job_id         : MongoDb.toObjectId( match.getJob() ),
            score          : match.getScore(),
        };   

        await db.collection("matches").insertOne(matchRow);
    }

    return true;
}
