/**
 * Original Author: Jack Watson
 * Created Date: 11/28/2021
 * Purpose: This file will handle interactions on the signup entity. Interactions such as reading a contract if we have a contract
 * attached to the signup, or resending the verification message for a second attempt if the client did not recieve the original 
 * message.
 */

// Mapper
import { find, update } from "../mappers/SignupMapper";

// Entities
import { Signup } from "../entities/Signup";

// External Dependencies
import { Notification } from "notify/Notification";
import { HandlebarsAdaptor } from "template/HandlebarsAdaptor";
import fs from "infa/FileSystemAdaptor";
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
        return res.sendFile(fs.absolutePath(fs.DOCUMENT, contractPath));   
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

    if(signup.sendVerification(notification, template))
    {
        await update(id, signup);
        return res.status(200);
    }
    
    return res.status(503).send({"error": "Could not resend verification. This has been logged for further investigation."});
}
