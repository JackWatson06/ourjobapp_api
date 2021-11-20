import * as MongoDb from "infa/MongoDb";
import * as Collections from "Collections";

import Match from "../entities/Match";
import BatchMatch from "../entities/BatchMatch";
import CandidateEmail from "../entities/CandidateEmail";

import { ObjectId } from "mongodb";

export async function create(email: CandidateEmail)
{
    const db: MongoDb.MDb = MongoDb.db();
    
    const match: BatchMatch         = email.getMatch();
    const batchId: string|undefined = match.getBatchId();
    const matches: Array<Match>     = match.getMatches();

    // Create the employer match.
    const batchMatchRow: Collections.BatchMatch = {
        employer_id : MongoDb.toObjectId( match.getEmployer().id ),
        created_at  : MongoDb.now()
    };

    if( batchId != undefined )
    {
        batchMatchRow.batch_id = MongoDb.toObjectId(batchId);
    }

    // Batchmatch
    const batchMatchId: ObjectId = (await db.collection("batchMatches").insertOne(batchMatchRow)).insertedId;

    // Create the email
    const emailRow: Collections.Email = {
        batch_match_id : batchMatchId,
        message_token  : email.getCacheIdentifier(),
        email          : match.getEmployer().email,
        sent           : email.getSent(),
        error          : email.getError(),
        sent_at        : email.getSentAt(),
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


