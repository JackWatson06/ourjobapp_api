/**
 * Original Author: Jack Watson
 * Created Date: 10/16/2021
 * Purpose: This file serves to persiste the affilaite domain model to our mongodb database.
 */

import { db, now, MDb } from "infa/MongoDb";
import * as Collections from "Collections";

import Affiliate from "../entities/Affiliate";
import { InsertOneResult } from "mongodb";

/**
 * Store the affiliate in the database. Return true or false if we were sucessful.... that would be cought thow if there
 * were an error maybe we just return void.
 * @param affiliate Affiliate we want to persist to memory.
 */
export async function create(affiliate: Affiliate): Promise<boolean>
{
    const verification = affiliate.getVerification();

    // Create the affiliate
    const mdb: MDb = db();
    const affiliateRow: Collections.Affiliate = {
        name      : affiliate.getName(),
        email     : verification.getEmail(),
        charity_id: affiliate.getCharityId(),
        verified  : false,
        created_at: now()
    };

    const insertedAffiliate: InsertOneResult<Document> = await mdb.collection("affiliates").insertOne(affiliateRow);

    // Create the verification email process
    const verificationRow: Collections.Verification = {
        resource          : "affiliates",
        resource_id       : insertedAffiliate.insertedId,
        verified          : false,
        verificationToken : verification.getToken(),
        created_at        : now()
    }

    return (await mdb.collection("verifications").insertOne(verificationRow)).acknowledged;
}
