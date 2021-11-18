
/**
 * Original Author: Jack Watson
 * Created At: 10/19/2021
 * Purpose: Singing up a new employer is a vital part of our domain. This code seeks to be in charge of creating a new employer
 * in our system.
 */
// Command (Gross)
import execEmployerMatch from "../../../modules/matching/commands/MatchOneCommand"

// Data Mappers
import * as EmployerMapper from "../mappers/EmployerMapper";
import * as ProofManager   from "../mappers/ProofMapper";
import * as AddressMapper  from "../mappers/AddressMapper";

// Entities
import Employer  from "../entities/Employer";
import Address   from "../entities/Address";
import Proof     from "../entities/Proof";

 // Validator
import { NewEmployer, schema } from "../validators/NewEmployerValidator";

// Repository
import { unique } from "../repositories/EmployerRepository";

// External dependencies
import * as express from "express";
import { EmailNotification } from "notify/EmailNotification";
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
        const address: Address   = await AddressMapper.read(data.place_id);
        const employer: Employer = new Employer(data, address);

        await EmployerMapper.create(employer).catch( (err) => {
            res.status(400).send( { "error" : true } )
        });

        // Verify the afiiliate is who they say they are.
        await employer.verify(new EmailNotification());

        return res.status(200).send( { "success": true } )
    }
    
    // Error code did not work
    return res.send( { "error" : true } );
}

/**
 * api.employer.verify - Verify the employer can use our system.
 * @param req Express request object
 * @param res Express response object
 */
export async function verify(req: express.Request<any>, res: express.Response)
{
    
    const token: string = req.body.token;

    const proof: Proof|null = await ProofManager.read(token);

    // Make sure that we can find the token
    if(proof === null)
    {
        return res.status(404).send({"error" : "Invalid verification link."});    
    }

    // Pull the affiliate from the database.,
    const employer: Employer|null = await EmployerMapper.read({ tokenId: proof.getId() });

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
    const authorized: boolean = employer.authorize(proof);

    if(authorized)
    {
        await EmployerMapper.update(proof.getId(), employer);

        res.status(200).send( {"success": true} );


        // Trigger the matching process here. Yes I know this is garbage and we will need to revist.
        execEmployerMatch(employer.getId());
    }
    else
    {
        res.status(400).send( {"error": "Token not valid"} )
    }
}

// /**
//  * api.employer.resend - Resend the employers verification link
//  * @param req Express request object
//  * @param res Express response object
//  */
// export async function resend(req: express.Request<any>, res: express.Response)
// {
//     const id: string = req.body.id;
    
//     // Pull the employer from the database.
//     const employer: Employer|null = await EmployerMapper.read({ _id: new ObjectId( id ) });
//     if(employer === null)
//     {
//         return res.status(400).send( { "error": "No employer found" } )
//     }

//     const sent: boolean = await employer.verify();

//     if(sent)
//     {
//         return res.status(200).send( { "success": true } )
//     }

//     return res.status(400).send( { "error": true } )
// }
