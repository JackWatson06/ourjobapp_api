
/**
 * Original Author: Jack Watson
 * Created At: 10/16/2021
 * Purpose: We need a way to interact with the underlying affiliates that we have in the system. This controller file
 * allows us to run different commands on the affiliate in order to set the state of a affiliate in our system.
 */

// Data Mappers
import { create, read, update } from "../mappers/AffiliateMapper";
import { read as readProof } from "../mappers/ProofMapper";

// Entities
import Affiliate from "../entities/Affiliate";
import Proof from "../entities/Proof";

import { unique } from "../repositories/AffiliateRepository";

 // Validator
import { NewAffiliate, schema } from "../validators/NewAffiliateValidator";

import transform from "../views/VerifiedAffiliateView";

// External dependencies
import * as express from "express";
import {TextNotification} from "notify/TextNotification";
import Ajv from "ajv";

/**
 * signup.affiliate.store - Create a brand new affiliate in the system.
 * @param req Express request object
 * @param res Express response object
 */
export async function store(req: express.Request<any>, res: express.Response)
{
    // Validate that the input coming on the request would be able to create a affiliate
    const ajv = new Ajv();
    const valid = ajv.compile(schema);

    const data: NewAffiliate = req.body;
    
    // Create the affilaite domain entity.
    if( valid(data) )
    {
        const affiliate: Affiliate = new Affiliate(data);

        // Send out a verificaiton email (included with their contract) Do the domain request before persistance thank you
        // very much.
        await affiliate.verify(new TextNotification());

        await create(affiliate).catch( (err) => {
            console.error(err);
            
            res.status(400).send( { "error" : true } )
        });

        return res.status(200).send( { "success": true } )
    }
    
    // Return a success code for the successful process ... were going to want to think of an elegant way to do this
    // throughout the application. Returning errors as well. Maybe we find something similar to fractal in PHP
    return res.status(400).send( { "error" : true } );
}

/**
 * signup.affiliate.verify - Verify the verification link
 * @param req Express request object
 * @param res Express response object
 */
export async function verify(req: express.Request<any>, res: express.Response)
{
    const token : string = req.params.id;
    const code  : string = req.body.code;
    const proof : Proof|null = await readProof(token, code);

    // Make sure that we can find the token
    if(proof === null)
    {
        return res.status(404).send({"error" : "Invalid verification code."});    
    }

    // Pull the affiliate from the database.,
    const affiliate: Affiliate|null = await read({ tokenId: proof.getId() });

    // Double check that the affiliate exists.
    if(affiliate === null)
    {
        return res.status(404).send({"error" : "Invalid verification link."});    
    }

    // If not unique then throw an error
    if( !( await unique( affiliate )) )
    {
        return res.status(400).send({"error" : "User with Link Name has already been authenticated."});    
    }

    // Othewise verify and persist.
    const authorized: boolean = affiliate.authorize(proof);

    if(authorized)
    {
        await update(proof.getId(), affiliate);

        return res.status(200).send( {
                "success": true,
                "data": transform(affiliate)
            } );
    }

    return res.status(400).send( {"error": "Token not valid"} )
}


// /**
//  * @todo We need to check this code again after this.
//  * signup.affiliate.resend - Resend the verification link
//  * @param req Express request object
//  * @param res Express response object
//  */
// export async function resend(req: express.Request<any>, res: express.Response)
// {
//     const id: string = req.body.id;
    
//     // Pull the affiliate from the database.
//     const affiliate: Affiliate|null = await read({ _id: id });
//     if(affiliate === null)
//     {
//         return res.status(400).send( { "error": "No affiliate found" } )
//     }

//     const sent: boolean = await affiliate.verify(new TextNotification());

//     if(sent)
//     {
//         return res.status(200).send( { "success": true } )
//     }

//     return res.status(400).send( { "error": true } )
// }
