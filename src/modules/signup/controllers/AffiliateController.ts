/**
 * This class will store a new affilaite using our signup system that we have in place.
 */

import { create } from "../mappers/SignupMapper";
import { Signup }            from "../entities/Signup";
import { Affiliate }         from "../entities/signups/Affiliate";
import { Token }             from "../entities/Token";
import { NewAffiliate, schema } from "../validators/NewAffiliateValidator";

import { Notification } from "notify/Notification";
import { HandlebarsAdaptor } from "template/HandlebarsAdaptor";
import express from "express";
import Ajv from "ajv";

/**
 * Store a new affiliate in the signup system that we have.
 * @param req Express request
 * @param res Express response
 */
export async function store(req: express.Request, res: express.Response)
{
    // Validate that the input coming on the request would be able to create a affiliate
    const ajv = new Ajv();
    const valid = ajv.compile(schema);

    const data: NewAffiliate = req.body;
    
    if( valid(data) )
    {
        const notification: Notification   = new Notification();
        const template: HandlebarsAdaptor  = new HandlebarsAdaptor();

        const token: Token                 = new Token();
        const entity: Affiliate            = new Affiliate(data);
        const signup: Signup               = new Signup(entity, token);

        await signup.addContract(entity, template);
        await signup.sendVerification(notification, template);
        
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
    
    return res.status(400).send( { "error" : "Data invalid." } );
}
