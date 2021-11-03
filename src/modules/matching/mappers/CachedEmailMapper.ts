import * as MongoDb from "infa/MongoDb";
import * as Collections from "Collections";

import Match from "../entities/Match";
import BatchMatch from "../entities/BatchMatch";
import CachedEmail from "../entities/CachedEmail";

import { ObjectId } from "mongodb";

export async function create(email: CachedEmail)
{
    const db: MongoDb.MDb = MongoDb.db();
    
    const match: BatchMatch = email.getMatch();
    const matches: Array<Match> = match.getMatches();

    // Create the employer match.
    const batchMatchRow: Collections.BatchMatch = {
        batch_id    : MongoDb.toObjectId( match.getBatchId() ),
        employer_id : MongoDb.toObjectId( match.getEmployer().id ),
        created_at  : MongoDb.now()
    };

    // Batchmatch
    const batchMatchId: ObjectId = (await db.collection("batchMatches").insertOne(batchMatchRow)).insertedId;

    // Create the email
    const emailRow: Collections.Email = {
        batch_match_id : batchMatchId,
        message_token  : email.getMessageToken(),
        email          : match.getEmployer().email,
        sent           : false,
        error          : false,
        created_at     : MongoDb.now()
    };   

    await db.collection("emails").insertOne(emailRow);

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

