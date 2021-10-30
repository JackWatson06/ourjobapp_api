import * as MongoDb from "infa/MongoDb";
import AffiliateCookie from "../entities/AffiliateCookie"

type AffiliateQuery = { 
    name: string;
    verified: boolean;
};

type AffiliateRow = {
    _id: string
}

export async function read(search: string): Promise<AffiliateCookie>
{
    const db: MongoDb.MDb = MongoDb.db();
    const query: AffiliateQuery = {
        name: search,
        verified: true 
    };

    return db.collection("affiliates").findOne<AffiliateRow>(query).then((document: AffiliateRow) => {
        return new AffiliateCookie(document._id);
    }).catch(() =>{
        throw new Error("404");
    });
}
