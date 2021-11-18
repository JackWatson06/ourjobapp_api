
/**
 * Original Author: Jack Watson
 * Created Date: 10/25/2021
 * Purpose: This class serves to read in the proof that a user needs to have in order to authenticate into the system
 */

import { db, MDb } from "infa/MongoDb";
import * as Collections from "Collections";

import Proof from "../entities/Proof";

export async function read(token: string, code ?: string)
{
    // Create the proof that we have verified this email.
    const mdb: MDb = db();
    const tokenRow: Collections.Token|null = await mdb.collection("tokens").findOne<Collections.Token>({
        token: token,
        code: code
    });

    if(tokenRow != null && tokenRow._id != undefined)
    {
        return new Proof(tokenRow._id.toString(), tokenRow.expired_at);
    }

    return null;
}
