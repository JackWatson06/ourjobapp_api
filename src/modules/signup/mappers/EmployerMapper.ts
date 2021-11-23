/**
 * Original Author: Jack Watson
 * Created Date: 10/16/2021
 * Purpose: This file serves to persist the employer domain model to our mongodb database.
 */

import Employer from "../entities/Employer";
import Token from "../entities/Token";
import Address from "../entities/Address";

import { NewEmployer } from "../validators/NewEmployerValidator";

import { InsertOneResult, ObjectId } from "mongodb";

import { db, now, MDb, toObjectId, toObjectIds } from "infa/MongoDb";
import * as Collections from "Collections";

/**
 * Read the employer object from the database. Parse the database row into the actual domain employer domain entity.
 * @param query Query we are running up against the database. See the options above.
 */
export async function toEntity(employer: Collections.Employer, location: Collections.Location): Promise<Employer|null>
{
    // Create the employer domain model
    const newEmployer: NewEmployer = {
        fname        : employer.fname,
        lname        : employer.lname,
        position     : employer.position,
        company_name : employer.company_name,
        website      : employer.website,
        place_id     : employer.place_id,
        experience   : employer.experience,
        salary       : employer.salary,
        commitment   : employer.commitment,
        where        : employer.where,
        authorized   : employer.authorized,
        email        : employer.email,
        industry     : employer.industry.map((industry: ObjectId) => industry.toString()),
        affiliate_id : employer.affiliate_id?.toString()
      }
    const employerEntity: Employer = new Employer(newEmployer, new Address(location.address));

    if(employer._id != null)
    {
        employerEntity.setId(employer._id.toString());
    }

    return employerEntity;   
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
    
    // === Persist Token ===
    const token: Token = employer.getToken();
    const tokenRow: Collections.Token = {
        token      : token.getToken(),
        expired_at : token.getExpiredDate(),
        created_at : now(),
        consumed   : false,
    };

    const newToken: InsertOneResult<Document> = await mdb.collection("tokens").insertOne(tokenRow)

    // === Pesrsist Contract ===
    const contractRow: Collections.Contract = {
        token_id: newToken.insertedId,
        fileName: employer.getContract()
    }
    const newContract: InsertOneResult<Document> = await mdb.collection("contracts").insertOne(contractRow);

    // === Persist Employer ===
    const data: NewEmployer = employer.getData();
    const employerRow: Collections.Employer = { 
        ...data,
        contract_id  : newContract.insertedId,
        industry     : toObjectIds(data.industry),
        affiliate_id : data.affiliate_id ? toObjectId(data.affiliate_id) : undefined,
        token_id     : newToken.insertedId,
        verified     : false
    };

    return ( await mdb.collection("employers").insertOne(employerRow)).acknowledged;
}


/**
 * Update the employer. Yes I know that we have to update this to actually persist the entity right now we only use this
 * function for changing the employer to A verified status.
 * @param query The query we are to find the correct employer to update.
 * @param employer Employer we want to persist to memory.
 */
export async function update(tokenId: string, employer: Employer): Promise<boolean>
{
    // Create the employer
    const mdb: MDb = db();

    await mdb.collection("tokens").updateOne({ _id: toObjectId(tokenId)}, {
        $set: {
            consumed: true,
        },
    })

    // Update the current collection
    return (await mdb.collection("employers").updateOne({ token_id: toObjectId(tokenId)}, { $set: {
        verified    : true,
        verified_on : employer.getVerifiedOn()
    } })).acknowledged;
}
