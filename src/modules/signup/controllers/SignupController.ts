/**
 * This file will handle interactions on the signup entity. Interactions such as reading a contract if we have a contract
 * attached to the signup, or resending the verification message for a second attempt if the client did not recieve the original 
 * message.
 */

import { find, update } from "../mappers/SignupMapper";
import { Signup } from "../entities/Signup";

import { Notification } from "notify/Notification";
import { HandlebarsAdaptor } from "template/HandlebarsAdaptor";
import fs from "infra/FileSystemAdaptor";
import express from "express";

/**
 * Read the contract from the sigup entity (if we are allowed to read the contract).
 * @param req Express request object
 * @param res Express response object
 */
export async function readContract(req: express.Request, res: express.Response)
{
    const id: string = req.params.id;

    const signup: Signup|null = await find(id);
    if(signup === null)
    {
        return res.status(404).send({"error": "Could not find active signup."})
    }

    const contractPath: string|null = signup.getContractPath();
    if(contractPath != null)
    {        
        return res.sendFile(fs.absolutePath(fs.DOCUMENT, contractPath), {
            headers: {
                "Content-Type" : "application/pdf"
            }
        });   
    }
    
    return res.status(404).send({"error": "Could not find the request contract."});
}

/**
 * Resend the verification message for a signup entity. 
 * @param req Express request object
 * @param res Express response object
 */
export async function resend(req: express.Request, res: express.Response)
{
    const id: string = req.params.id;

    const notification: Notification   = new Notification();
    const template: HandlebarsAdaptor  = new HandlebarsAdaptor();

    const signup: Signup|null = await find(id);
    
    if(signup === null)
    {
        return res.status(404).send({"error": "Could not find the current signup."})
    }
    
    if(await signup.sendVerification(notification, template))
    {   
        await update(id, signup);
        
        return res.status(200).send( {"success": "Successfully resent your secret!" });
    }
    
    return res.status(503).send({"error": "Could not resend verification. This has been logged for further investigation."});
}
