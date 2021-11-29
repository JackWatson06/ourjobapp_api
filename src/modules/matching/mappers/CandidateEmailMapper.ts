import { collections, toObjectId, now } from "db/MongoDb";
import { Schema } from "db/DatabaseSchema";

import Match from "../entities/Match";
import BatchMatch from "../entities/BatchMatch";
import CandidateEmail from "../entities/CandidateEmail";

import { ObjectId } from "mongodb";

export async function create(email: CandidateEmail)
{

    const match: BatchMatch         = email.getMatch();
    const batchId: string|undefined = match.getBatchId();
    const matches: Array<Match>     = match.getMatches();

    // Create the employer match.
    const batchMatchRow: Schema.BatchMatch = {
        employer_id : toObjectId( match.getEmployer().id ),
        created_at  : now()
    };

    if( batchId != undefined )
    {
        batchMatchRow.batch_id = toObjectId(batchId);
    }

    // Batchmatch
    const batchMatchId: ObjectId = (await collections.batch_matches.insertOne(batchMatchRow)).insertedId;

    // Create the email
    const emailRow: Schema.Email = {
        batch_match_id : batchMatchId,
        message_token  : email.getCacheIdentifier(),
        email          : match.getEmployer().email,
        sent           : email.getSent(),
        error          : email.getError(),
        sent_at        : email.getSentAt(),
        created_at     : now()
    };   

    await collections.emails.insertOne(emailRow);

    // Loop through all of the employees that matched with the employer.
    for(const match of matches)
    {
        const matchRow: Schema.Match = {
            batch_match_id : batchMatchId,
            employee_id    : toObjectId( match.getEmployee().id ),
            job_id         : toObjectId( match.getJob().getId() ),
            score          : match.getScore(),
        };   

        await collections.matches.insertOne(matchRow);
    }

    return true;
}


