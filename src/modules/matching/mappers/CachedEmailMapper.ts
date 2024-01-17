import { collections, toObjectId } from "db/MongoDb";
import CachedEmail from "../entities/CachedEmail";

export async function read(): Promise<Array<CachedEmail>> 
{
    return collections.emails.find({ sent: false, error: false }).map(( result ) => {
        return new CachedEmail( result._id?.toString() ?? "", result.message_token );
    }).toArray();
}


export async function update(emails: Array<CachedEmail>): Promise<boolean>
{
    for(const email of emails)
    {
        // Update the current collection
        await collections.emails.updateOne({ _id: toObjectId(email.getId()) }, { $set: {
            sent    : email.getSent(),
            sent_at : email.getSentAt(),
            error   : email.getError()
        } });
    }

    return true;
}


