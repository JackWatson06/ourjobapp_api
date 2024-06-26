/**
 * This mapper manages the process to convert a AffiliateCookie entity to the database.
 */

import {collections} from "db/MongoDb";
import AffiliateCookie from "../entities/AffiliateCookie"

type AffiliateQuery = { 
    name: string;
};

type AffiliateRow = {
    _id: string
}

export async function read(search: string): Promise<AffiliateCookie>
{
    const query: AffiliateQuery = {
        name: search
    };

    return collections.affiliates.findOne<AffiliateRow>(query).then((document: AffiliateRow) => {
        return new AffiliateCookie(document._id);
    }).catch(() =>{
        throw new Error("404");
    });
}
