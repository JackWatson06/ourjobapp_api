import * as MongoDb from "infa/MongoDb";
import ExistingResource from "../entities/ExistingResource";

type ExistinEmailQuery = { 
    email: RegExp;
    verified: boolean;
};

export async function read(search: string, source: string): Promise<ExistingResource>
{
    const db: MongoDb.MDb = MongoDb.db();
    const query: ExistinEmailQuery = {
        "email"   : new RegExp(`^${search}$`, "i"),
        "verified": true
    };

    const hasOneEmail: number = await db.collection(source).find(query).limit(1).count();
    return new ExistingResource( hasOneEmail != 0 );
}
