
/**
 * Original Author: Jack Watson
 * Created At: 10/19/2021
 * Purpose: Singing up a new employer is a vital part of our domain. This code seeks to be in charge of creating a new employer
 * in our system.
 */

// Data Mappers
import { create, read, update } from "../mappers/EmployerMapper";
import { read as readProof } from "../mappers/ProofMapper";
import { ObjectId } from "mongodb";

// Entities
import Employer  from "../entities/Employer";
import Email     from "../entities/Email";
import Token     from "../entities/Token";
import Proof     from "../entities/Proof";

 // Validator
import { NewEmployer, schema } from "../validators/NewEmployerValidator";

// Repository
import { unique } from "../repositories/EmployerRepository";

// External dependencies
import * as express from "express";
import Ajv from "ajv";

/**
 * signup.employer.store - Create a brand new employer in our system.
 * @param req Express request object
 * @param res Express response object
 */
export async function store(req: express.Request<any>, res: express.Response)
{
    const ajv = new Ajv();

    // Validate that the input coming on the request would be able to create a employer
    const valid = ajv.compile(schema);
    const data: NewEmployer = req.body;

    // Create the affilaite domain entity.
    if( valid(data) )
    {
        const email: Email       = new Email(data.email, Token.generate());
        const employer: Employer = new Employer(data, email);

        // Verify the employer is who they say they are.
        await employer.verify();

        return await create(employer).then( () => {
            res.send( { "success": true } )
        }).catch( () => {
            res.send( { "error" : true } )
        });
    }

    // Error code did not work
    return res.send( { "error" : true } );
}

/**
 * api.employer.resend - Resend the employers verification link
 * @param req Express request object
 * @param res Express response object
 */
export async function resend(req: express.Request<any>, res: express.Response)
{
    const id: string = req.body.id;
    
    // Pull the employer from the database.
    const employer: Employer|null = await read({ _id: new ObjectId( id ) });
    if(employer === null)
    {
        return res.status(400).send( { "error": "No employer found" } )
    }

    const sent: boolean = await employer.verify();

    if(sent)
    {
        return res.status(200).send( { "success": true } )
    }

    return res.status(400).send( { "error": true } )
}

/**
 * api.employer.verify - Verify the employer can use our system.
 * @param req Express request object
 * @param res Express response object
 */
export async function verify(req: express.Request<any>, res: express.Response)
{
    
    const token: string = req.body.token;

    const proof: Proof|null = await readProof(token);

    // Make sure that we can find the token
    if(proof === null)
    {
        return res.status(404).send({"error" : "Invalid verification link."});    
    }

    // Pull the affiliate from the database.,
    const employer: Employer|null = await read({ token_id: new ObjectId( proof.getId()) });

    // Double check that the affiliate exists.
    if(employer === null)
    {
        return res.status(404).send({"error" : "Invalid verification link."});    
    }

    // If not unique then throw an error
    if( !( await unique( employer )) )
    {
        return res.status(400).send({"error" : "Employer with email has already been authenticated."});    
    }

    // Othewise verify and persist.
    const authorized: boolean = employer.authorize();

    if(authorized)
    {
        await update({ token_id: new ObjectId( proof.getId())}, employer);
        return res.status(200).send( {"success": true} );
    }

    return res.status(400).send( {"error": "Token not valid"} )
}
