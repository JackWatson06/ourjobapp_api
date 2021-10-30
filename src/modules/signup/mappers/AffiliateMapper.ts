/**
 * Original Author: Jack Watson
 * Created Date: 10/16/2021
 * Purpose: This file serves to persiste the affilaite domain model to our mongodb database.
 */

import { db, now, MDb } from "infa/MongoDb";
import * as Collections from "Collections";

import { NewAffiliate } from "../validators/NewAffiliateValidator";

import Affiliate from "../entities/Affiliate";
import Email from "../entities/Email";
import Token from "../entities/Token";

import { InsertOneResult, ObjectId } from "mongodb";

type Query = {
    _id      ?: ObjectId,
    token_id ?: ObjectId,
    name     ?: string,
    email    ?: string,
    verified ?: boolean
}

type UpdateQuery = {
    token_id ?: ObjectId
}
/**
 * Store the affiliate in the database. Return true or false if we were sucessful.... that would be cought thow if there
 * were an error maybe we just return void.
 * @param affiliate Affiliate we want to persist to memory.
 */
export async function read(query: Query): Promise<Affiliate|null>
{
    const mdb: MDb = db();

    const affiliateRow: Collections.Affiliate|null = await mdb.collection("affiliates").findOne<Collections.Affiliate>(query);
    
    if( affiliateRow === null )
    {
        return null;
    }

    const tokenRow: Collections.Token|null = await mdb.collection("tokens").findOne<Collections.Token>({ _id: affiliateRow.token_id});

    if(tokenRow === null)
    {
        return null;
    }

    const token = new Token(tokenRow.token, tokenRow.expired_at);
    const email = new Email(affiliateRow.email, token);
    return new Affiliate(affiliateRow as NewAffiliate, email);
}

/**
 * Store the affiliate in the database. Return true or false if we were sucessful.... that would be cought thow if there
 * were an error maybe we just return void.
 * @param affiliate Affiliate we want to persist to memory.
 */
export async function create(affiliate: Affiliate): Promise<boolean>
{
    const mdb: MDb = db();
    
    const email: Email = affiliate.getEmail();
    const tokenRow: Collections.Token = {
        token       : email.getToken(),
        expired_at  : email.getExpiredDate(),
        created_at  : now()
    }

    const newToken: InsertOneResult<Document> = await mdb.collection("tokens").insertOne(tokenRow)

    const data: NewAffiliate = affiliate.getData();
    const affiliateRow: Collections.Affiliate = {
        name        : data.name,
        charity_id  : data.charity_id,
        affiliate_id: data.affiliate_id ? new ObjectId(data.affiliate_id): undefined,
        email       : email.getEmail(),
        verified    : false,
        token_id    : newToken.insertedId,
        created_at  : now()
    };

    return ( await mdb.collection("affiliates").insertOne(affiliateRow) ).acknowledged;
}

/**
 * Yes I know this is awful code. But it was quick and dirty since we were on a TIGHT deadline. Get it working or die
 * as a company. Essentially here we are saying that when we UPDATE we automiatcally are only able to set if they are verified.
 * That is 100% business logic. DO NOT CALL FROM OUTSIDE authorize method iniside AffiliateController. If you do change the code
 * below so it is more general, and add a verified on the affiliate entity.
 * @param affiliate Affiliate we want to persist to memory.
 */
export async function update(query: UpdateQuery, affiliate: Affiliate): Promise<boolean>
{
    const mdb: MDb = db();

    // Update the current collection
    return (await mdb.collection("affiliates").updateOne(query, { $set: {
        verified    : true,
        verified_on : affiliate.getVerifiedAt()
    } })).acknowledged;
}
