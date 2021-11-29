/**
 * Original Author: Jack Watson
 * Created Date: 10/30/2021
 * Purpose: This mapper manages the process to convert a AffiliateCookie entity to the database.
 */


import {collections} from "db/MongoDb";
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
    const query: AffiliateQuery = {
        name: search,
        verified: true 
    };

    return collections.affiliates.findOne<AffiliateRow>(query).then((document: AffiliateRow) => {
        return new AffiliateCookie(document._id);
    }).catch(() =>{
        throw new Error("404");
    });
}
