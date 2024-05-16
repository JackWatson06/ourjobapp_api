/**
 * This class will store a new employee using our signup system that we have in place.
 * 
 */
import { create } from "../mappers/SignupMapper";
import { findAddress } from "../mappers/AddressMapper";
import { getId } from "../repositories/SignupRepository";
import { Signup }    from "../entities/Signup";
import { Employer }  from "../entities/signups/Employer";
import { Address }   from "../entities/Address";
import { Token }     from "../entities/Token";
import { NewEmployer, schema } from "../validators/NewEmployerValidator";

// External dependencies
import { Notification } from "notify/Notification";
import { HandlebarsAdaptor } from "template/HandlebarsAdaptor";
import express from "express";
import Ajv from "ajv";
 
/**
 * Store a new employee in the signup system that we have.
 * @param req Express request
 * @param res Express response
 */
export async function store(req: express.Request, res: express.Response)
{
    const ajv = new Ajv();
    const valid = ajv.compile(schema);

    const data: NewEmployer = req.body;
        
    if( valid(data) )
    {   
        const template: HandlebarsAdaptor = new HandlebarsAdaptor();
        const address: Address = await findAddress(data.place_id);
           
        const token: Token     = new Token();
        const entity: Employer = new Employer(getId(), data, address);
        const signup: Signup   = new Signup(entity, token);
        
        await signup.addContract(entity, template);
        await signup.sendVerification(new Notification(), template);

        try
        {
            const id: string|null = await create(signup);
            return res.status(200).send({ id: id });
        }
        catch(err)
        {
            return res.status(503).send({"error": "Could not create signup."})
        }
    }

    console.error(valid.errors);
    
    return res.status(400).send( { "error" : "Data invalid." } );
}
