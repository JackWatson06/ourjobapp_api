
/**
 * Original Author: Jack Watson
 * Created At: 10/16/2021
 * Purpose: We need a way to interact with the underlying affiliates that we have in the system. This controller file
 * allows us to run different commands on the affiliate in order to set the state of a affiliate in our system.
 */

// Data Mappers
import { create, read, update } from "../mappers/AffiliateMapper";

// Entities
import Affiliate from "../entities/Affiliate";
import Email from "../entities/Email";
import Token from "../entities/Token";

import { unique } from "../repositories/AffiliateRepository";

 // Validator
import { NewAffiliate, schema } from "../validators/NewAffiliateValidator";

// External dependencies
import * as express from "express";
import Ajv from "ajv";

/**
 * api.affiliate.store - Create a brand new affiliate in the system.
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
        const email: Email = new Email(data.email, Token.generate());
        const affiliate: Affiliate   = new Affiliate(data.name, data.charity_id, email);

        await create(affiliate).catch( (err) => {
            console.error(err);
            res.status(400).send( { "error" : true } )
        });

        // Verify the afiiliate is who they say they are.
        await affiliate.verify();

        return res.status(200).send( { "success": true } )
    }
    
    // Error code did not work./
    return res.status(400).send( { "error" : true } );
    
    // Return a success code for the successful process ... were going to want to think of an elegant way to do this
    // throughout the application. Returning errors as well. Maybe we find something similar to fractal in PHP
}

/**
 * api.affiliate.show - Show the current affiliate to the frontend so we can grab useful properties from the url.
 * @param req Express request object
 * @param res Express response object
 */
export async function show(req: express.Request<any>, res: express.Response){ }


/**
 * api.affiliate.verify - Create a brand new affiliate in the system.
 * @param req Express request object
 * @param res Express response object
 */
export async function verify(req: express.Request<any>, res: express.Response)
{
    const id: string = req.params.id.trim();

    // Pull the affiliate from the database.,
    const affiliate: Affiliate|null = await read({ _id: id });
    if(affiliate === null)
    {
        return res.status(400).send( { "error": true } )
    }

    const sent: boolean = await affiliate.verify();

    if(sent)
    {
        return res.status(200).send( { "success": true } )
    }

    return res.status(400).send( { "error": true } )
}

/**
 * api.affiliate.verify - Create a brand new affiliate in the system.
 * @param req Express request object
 * @param res Express response object
 */
export async function authorize(req: express.Request<any>, res: express.Response)
{
    const id: string = req.params.id.trim();

    // Pull the affiliate from the database.,
    const affiliate: Affiliate|null = await read({ token_id: id });

    // Make sure that we can find the token
    if(affiliate === null)
    {
        return res.status(404).send({"error" : "Could not find verification link."});    
    }

    // If not unique then throw an error
    if( !unique( affiliate ))
    {
        return res.status(400).send({"error" : "User with Email, or Link Name has already been authenticated."});    
    }

    // Othewise verify and persist.
    const authorized: boolean = affiliate.authorize();

    if(authorized)
    {
        await update({"token_id": id}, affiliate);
        return res.status(200).send( {"success": true} );
    }

    return res.status(400).send( {"error": "Token not valid"} )
}
