/**
 * Original Author: Jack Watson
 * Created Date: 10/20/2021
 * Purpose: Verivication mapper in order to read in the state of a verified resource to the frontend.
 */

import { db, MDb } from "infa/MongoDb";
import * as Collections from "Collections";

import Verification from "../entities/Verification";
import { ObjectId } from "mongodb";

// Query for reading the verification.
type ReadQuery = {
    token: string,
    verified: boolean
}


// Update types
type UpdateId = {
    _id : ObjectId
}

type UpdateQuery = {
    verified_on : number,
    verified    : boolean,
}

type UpdateResourceQuery = {
    verified : boolean
}

/**
 * Grab the current verification within the database so that we can verify that we are actually 
 * @param verificationToken Verification token that we are using to grab the verification model from the database.
 */
export async function read(verificationToken: string): Promise<Verification|null>
{
    console.log(verificationToken);
    
    // Create the affiliate
    const mdb: MDb = db();

    const query: ReadQuery = {
        token     : verificationToken,
        verified  : false
    }

    console.log(query);
    
    // Try to find the collection with the given verificaiton token passed in.
    return await mdb.collection("verifications").findOne(query).then((document: Collections.Verification) => {

        if( document != null && document._id != null )
        {
            return new Verification(
                document._id.toString(), 
                document.expired_at, 
                document.resource, 
                document.resource_id.toString())
        }
        else
        {
            return null;
        }
    });
}


/**
 * Update the status of a verification in our system. This will be set to whatever the domain layer spat out. 
 * @param verification Verification that we are persisting.
 */
export async function update(verification: Verification): Promise<boolean>
{

    // Create the affiliate
    const mdb: MDb = db();

    console.log(verification.getId());
    

    // Update information.
    const updateId: UpdateId = {
        _id: new ObjectId( verification.getId() )
    }
    const updateQuery: UpdateQuery = 
    {
        verified_on : verification.getVerifiedOn(),
        verified    : verification.getVerified()
    };

    // Verification Resource information.
    const resourceUpdateId: UpdateId = {
        _id: new ObjectId( verification.getResourceId() ) 
    }
    const resourceUpdateQuery: UpdateResourceQuery = {
        verified : verification.getVerified()
    }

    // Update the current collection
    await mdb.collection("verifications").updateOne(updateId, { $set: updateQuery });

    // Update the collection that we are storing for this verification.
    return ( await mdb.collection( verification.getResource() )
                            .updateOne(resourceUpdateId, { $set: resourceUpdateQuery } ) ).acknowledged;
}
