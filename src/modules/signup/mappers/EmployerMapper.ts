/**
 * Original Author: Jack Watson
 * Created Date: 10/16/2021
 * Purpose: This file serves to persist the employer domain model to our mongodb database.
 */

import Employer from "../entities/Employer";
import Email from "../entities/Email";
import Token from "../entities/Token";

import { NewEmployer } from "../validators/NewEmployerValidator";

import { InsertOneResult, ObjectId } from "mongodb";

import { db, now, MDb } from "infa/MongoDb";
import * as Collections from "Collections";

type Query = {
    _id      ?: ObjectId,
    token_id ?: ObjectId,
    email    ?: string,
    verified ?: boolean
}

type UpdateQuery = {
    token_id : ObjectId
}

/**
 * Store the employer in the database. Return true or false if we were sucessful.... that would be cought thow if there
 * were an error maybe we just return void.
 * @param employer Employer we want to persist to memory.
 */
export async function create(employer: Employer): Promise<boolean>
{
    // Create the employer
    const mdb: MDb = db();
    
    const email: Email = employer.getEmail();
    const tokenRow: Collections.Token = {
        token       : email.getToken(),
        expired_at  : email.getExpiredDate(),
        created_at  : now()
    }

    const newToken: InsertOneResult<Document> = await mdb.collection("tokens").insertOne(tokenRow)

    const data: NewEmployer = employer.getData();
    const employerRow: Collections.Employer = { 
        ...data,
        contract     : employer.getContract(),
        industry     : data.industry.map((industry: string) => new ObjectId(industry)),
        affiliate_id : data.affiliate_id ? new ObjectId(data.affiliate_id): undefined,
        token_id     : newToken.insertedId,
        verified     : false
    };

    return ( await mdb.collection("employers").insertOne(employerRow)).acknowledged;
}


/**
 * Read the employer object from the database. Parse the database row into the actual domain employer domain entity.
 * @param query Query we are running up against the database. See the options above.
 */
export async function read(query: Query): Promise<Employer|null>
{
    const mdb: MDb = db();

    // Load the employer
    const employerRow: Collections.Employer|null = await mdb.collection("employers").findOne<Collections.Employer>(query);
    
    if( employerRow === null )
    {
        return null;
    }

    // Load the employers token
    const tokenRow: Collections.Token|null = await mdb.collection("tokens").findOne<Collections.Token>({ _id: employerRow.token_id});

    if(tokenRow === null)
    {
        return null;
    }

    // Create the employer domain model
    const token = new Token(tokenRow.token, tokenRow.expired_at);
    const email = new Email(employerRow.email, token);
    const employer: NewEmployer = {
        fname        : employerRow.fname,
        lname        : employerRow.lname,
        position     : employerRow.position,
        company_name : employerRow.company_name,
        website      : employerRow.website,
        place_id     : employerRow.place_id,
        experience   : employerRow.experience,
        salary       : employerRow.salary,
        commitment   : employerRow.commitment,
        where        : employerRow.where,
        authorized   : employerRow.authorized,
        email        : employerRow.email,
        industry     : employerRow.industry.map((industry: ObjectId) => industry.toString()),
        affiliate_id : employerRow.affiliate_id?.toString()
      }
    return new Employer(employer, email);
}

/**
 * Update the employer. Yes I know that we have to update this to actually persist the entity right now we only use this
 * function for changing the employer to A verified status.
 * @param query The query we are to find the correct employer to update.
 * @param employer Employer we want to persist to memory.
 */
export async function update(query: UpdateQuery, employer: Employer): Promise<boolean>
{
    // Create the employer
    const mdb: MDb = db();

    // Update the current collection
    return (await mdb.collection("employers").updateOne(query, { $set: {
        verified    : true,
        verified_on : employer.getVerifiedOn()
    } })).acknowledged;
}
