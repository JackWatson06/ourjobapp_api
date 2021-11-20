/**
 * Original Author: Jack Watson
 * Created Date: 10/24/2021
 * Purpose: The repo serves the purpose of aggregating multiple Affiliates to act as an in memory database.
 */

import { db, MDb, toObjectId } from "infa/MongoDb";
import * as Collections from "Collections";

import Affiliate from "../entities/Affiliate";
import { toEntity } from "../mappers/AffiliateMapper";

/**
 * Get the affiliate from the persistance layer.
 */
export async function getFromTokenId( tokenId: string) : Promise<Affiliate|null>
{   
    const mdb: MDb = db();

    // We need to turn the query into mongodb language.
    const affiliateRow: Collections.Affiliate|null = await mdb.collection("affiliates").findOne<Collections.Affiliate>({
            token_id : toObjectId(tokenId),
        });

    if(affiliateRow === null)
    {
        return null;
    }

    return toEntity(affiliateRow);
}

/**
 * Confirm if the affiliate passed in is unique.
 */
export async function unique( affiliate: Affiliate) : Promise<boolean>
{   
    const mdb: MDb = db();

    const affiliateRow: Collections.Affiliate|null = await mdb.collection("affiliates").findOne<Collections.Affiliate>({
        name : affiliate.getName(),
        verified: true
    });

    // If both of these pased then we can assume they are unique.
    return affiliateRow === null;
}
