import * as MongoDb from "infa/MongoDb";
import ExistingResource from "../entities/ExistingResource";

type ExistinEmailQuery = { 
    email: string;
    verified: boolean;
};

export async function read(search: string, source: string): Promise<ExistingResource>
{
    const db: MongoDb.MDb = MongoDb.db();
    const query: ExistinEmailQuery = {
        "email"   : search,
        "verified": true
    };

    const hasOneEmail: number = await db.collection(source).find(query).limit(1).count();
    return new ExistingResource( hasOneEmail != 0 );
}
