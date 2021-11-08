import * as MongoDb from "infa/MongoDb";
import * as Collections from "Collections";

import CachedEmail from "../entities/CachedEmail";


export async function read(): Promise<Array<CachedEmail>> 
{
    const db: MongoDb.MDb = MongoDb.db();

    return db.collection("emails").find<Collections.Email>({ sent: false, error: false }).map(( result ) => {
        return new CachedEmail( result._id?.toString() ?? "", result.message_token );
    }).toArray();
}


export async function update(emails: Array<CachedEmail>): Promise<boolean>
{
    const db: MongoDb.MDb = MongoDb.db();

    for(const email of emails)
    {
        // Update the current collection
        await db.collection("emails").updateOne({ _id: MongoDb.toObjectId(email.getId()) }, { $set: {
            sent    : email.getSent(),
            sent_at : email.getSentAt(),
            error   : email.getError()
        } });
    }

    return true;
}


