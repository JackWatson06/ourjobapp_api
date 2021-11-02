import * as MongoDb from "infa/MongoDb";
import * as Collections from "Collections";

import BatchMatch from "../entities/BatchMatch";

export async function create(match: BatchMatch): Promise<boolean>
{
    const db: MongoDb.MDb = MongoDb.db();

    const matchRow: Collections.Match = {
        batch_id    : MongoDb.toObjectId( match.getBatchId() ),
        employer_id : MongoDb.toObjectId( match.getEmployerId() ),
        matches     : MongoDb.toObjectIds(match.getEmployees()),
        scores      : match.getScores(),
        created_at  : MongoDb.now()
    }

    return ( await db.collection("matches").insertOne(matchRow)).acknowledged;
}

