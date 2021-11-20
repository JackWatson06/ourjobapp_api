/**
 * Original Author: Jack Watson
 * Created Date: 10/16/2021
 * Purpose: This file serves to persiste the affilaite domain model to our mongodb database.
 */

import { db, now, MDb, toObjectId } from "infa/MongoDb";
import * as Collections from "Collections";

import { NewAffiliate } from "../validators/NewAffiliateValidator";

import Affiliate from "../entities/Affiliate";
import PhoneToken from "../entities/PhoneToken";
import Token from "../entities/Token";

import { InsertOneResult } from "mongodb";

type Query = {
    tokenId   ?: string;
    name      ?: string;
    verified  ?: boolean;
};

/**
 * Store the affiliate in the database. Return true or false if we were sucessful.... that would be cought thow if there
 * were an error maybe we just return void.
 * @param affiliate Affiliate we want to persist to memory.
 */
export async function create(affiliate: Affiliate): Promise<boolean> {
    const mdb: MDb = db();

    // === Persist Token ===
    const phoneToken: PhoneToken = affiliate.getToken();
    const token: Token = phoneToken.getToken();
    const tokenRow: Collections.Token = {
        consumed   : false,
        code       : phoneToken.getCode(),
        token      : token.getToken(),
        expired_at : token.getExpiredDate(),
        created_at : now(),
    };

    const newToken: InsertOneResult<Document> = await mdb
        .collection("tokens")
        .insertOne(tokenRow);


    // === Pesrsist Contract ===
    const contractRow: Collections.Contract = {
        token_id: newToken.insertedId,
        fileName: affiliate.getContract()
    }
    const newContract: InsertOneResult<Document> = await mdb.collection("contracts").insertOne(contractRow);



    // === Persist Affiliate ===
    const data: NewAffiliate = affiliate.getData();
    
    const affiliateRow: Collections.Affiliate = {
        charity_id   : toObjectId(data.charity_id),
        affiliate_id : data.affiliate_id ? toObjectId(data.affiliate_id): undefined,
        name         : data.name,
        phone        : data.phone,
        token_id     : newToken.insertedId,
        contract_id  : newContract.insertedId,
        verified     : false,
        created_at   : now(),
    };

    return (await mdb.collection("affiliates").insertOne(affiliateRow))
        .acknowledged;
}

/**
 * Store the affiliate in the database. Return true or false if we were sucessful.... that would be cought thow if there
 * were an error maybe we just return void.
 * @param affiliate Affiliate we want to persist to memory.
 */
export async function read(query: Query): Promise<Affiliate | null> {
    const mdb: MDb = db();


    // We need to turn the query into mongodb language.
    const affiliateRow: Collections.Affiliate|null = await mdb
        .collection("affiliates")
        .findOne<Collections.Affiliate>({
            token_id : query.tokenId ? toObjectId(query.tokenId) : undefined,
            name     : query.name,
            verified : query.verified
        });

    if (affiliateRow === null) {
        return null;
    }

    return new Affiliate({
        ...affiliateRow,
        affiliate_id : affiliateRow.affiliate_id?.toString(),
        charity_id   : affiliateRow.charity_id.toString()
    });
}

/**
 * Yes I know this is awful code. But it was quick and dirty since we were on a TIGHT deadline. Get it working or die
 * as a company. Essentially here we are saying that when we UPDATE we automiatcally are only able to set if they are verified.
 * That is 100% business logic. DO NOT CALL FROM OUTSIDE authorize method iniside AffiliateController. If you do change the code
 * below so it is more general, and add a verified on the affiliate entity.
 * @param affiliate Affiliate we want to persist to memory.
 */
export async function update(tokenId: string, affiliate: Affiliate): Promise<boolean> {
    const mdb: MDb = db();

    // Mark the token as consumed.
    await mdb.collection("tokens").updateOne({ _id: toObjectId(tokenId)}, {
        $set: {
            consumed: true,
        },
    })

    // Update the current collection.
    return (
        await mdb.collection("affiliates").updateOne({ token_id: toObjectId(tokenId)}, {
            $set: {
                verified: true,
                verified_on: affiliate.getVerifiedAt(),
            },
        })
    ).acknowledged;
}
