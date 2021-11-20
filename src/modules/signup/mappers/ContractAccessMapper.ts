/**
 * Original Author: Jack Watson
 * Created Date: 11/20/2021
 * Purpose: This file will load in a new contracdt access file from our persistance layer.
 */

import { db, now, MDb, toObjectId } from "infa/MongoDb";
import * as Collections from "Collections";

import ContractAccess from "../entities/ContractAccess";
import { CollectionOptions } from "mongodb";

export async function read(id: string)
{
    const mdb: MDb = db();
    const contract: Collections.Contract|null = await mdb.collection("tokens").findOne<Collections.Contract>({ _id: toObjectId(id) });

    if(contract === null)
    {
        return null;
    }

    const token: Collections.Token|null = await mdb.collection("tokens").findOne<Collections.Token>({ _id: contract.token_id });

    // How can I avoid these checks. How can I get typescript to do that for me... can I?
    if(token === null)
    {
        return null;
    }

    return new ContractAccess(contract.fileName, token.consumed, token.expired_at);
}
