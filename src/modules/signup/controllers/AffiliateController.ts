
/**
 * Original Author: Jack Watson
 * Created At: 10/16/2021
 * Purpose: We need a way to interact with the underlying affiliates that we have in the system. This controller file
 * allows us to run different commands on the affiliate in order to set the state of a affiliate in our system.
 */

// Data Mappers
import { create } from "../mappers/AffiliateMapper";

// Entities
import Affiliate from "../entities/Affiliate";
import UnverifiedEmail from "../entities/UnverifiedEmail";

 // Validator
import { NewAffiliate, schema} from "../validators/NewAffiliateValidator";

// External dependencies
import * as express from "express";
import Ajv from "ajv";

const ajv = new Ajv();

/**
 * api.affiliate.store - Create a brand new affiliate in the system.
 * @param req Express request object
 * @param res Express response object
 */
export async function store(req: express.Request<any>, res: express.Response)
{
    // Validate that the input coming on the request would be able to create a affiliate
    const valid = ajv.compile(schema);

    // Create the affilaite domain entity.
    if( valid(req.body) )
    {
        const data: NewAffiliate = req.body as NewAffiliate;

        const email: UnverifiedEmail = new UnverifiedEmail(data.email);
        const affiliate: Affiliate   = new Affiliate(data.name, data.charity_id, email);

        // Verify the afiiliate is who they say they are.
        await affiliate.verify();

        return await create(affiliate).then( () => {
            res.send( { "success": true } )
        }).catch( (err) => {
            console.error(err);
            res.send( { "error" : true } )
        });
    }
    
    // Error code did not wokr./
    return res.send( { "error" : true } );
    
    // Return a success code for the successful process ... were going to want to think of an elegant way to do this
    // throughout the application. Returning errors as well. Maybe we find something similar to fractal in PHP
}

/**
 * api.affiliate.show - Show the current affiliate to the frontend so we can grab useful properties from the url.
 * @param req Express request object
 * @param res Express response object
 */
export async function show(req: express.Request<any>, res: express.Response){ }
