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
import { getLocationByPlaceId } from "infa/GoogleApiAdaptor";
import * as Collections from "Collections";

type Query = {
    tokenId  ?: string,
    email    ?: string,
    verified ?: boolean
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
 * Read the employer object from the database. Parse the database row into the actual domain employer domain entity.
 * @param query Query we are running up against the database. See the options above.
 */
export async function read(query: Query): Promise<Employer|null>
{
    const mdb: MDb = db();

    // Load the employer
    const employerRow: Collections.Employer|null = await mdb
        .collection("employers")
        .findOne<Collections.Employer>({
            token_id : query.tokenId ? toObjectId(query.tokenId) : undefined,
            email    : query.email,
            verified : query.verified
        });
    
    if( employerRow === null )
    {
        return null;
    }

    // Load the employers token
    const tokenRow: Collections.Token|null = await mdb
        .collection("tokens")
        .findOne<Collections.Token>({ _id: employerRow.token_id});

    if(tokenRow === null)
    {
        return null;
    }

    const locationData: Collections.Location = await getLocationByPlaceId(employerRow.place_id);

    // Create the employer domain model
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
    const employerEntity: Employer = new Employer(employer, new Address(locationData.address));

    if(employerRow._id != null)
    {
        employerEntity.setId(employerRow._id.toString());
    }

    return employerEntity;   
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
