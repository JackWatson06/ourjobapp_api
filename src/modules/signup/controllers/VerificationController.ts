

/**
 * Original Author: Jack Watson
 * Created At: 10/20/2021
 * Purpose: This class seesk to handle interactions on the verificaiton system we have in place in order to confirm that individuals
 * are who they say they are.
 */

// Mappers
import * as VerificationMapper from "../mappers/VerificationMapper";

// Domain
import Verification from "../entities/Verification";

// External Dependencies
import * as express from "express";


/**
 * Handle updating the verificaiton of a user. We need to verify that the entity that just signed up actually has control
 * over the email address they signed up as.
 * @param req Express request object
 * @param res Express response object
 */
export async function resend(req: express.Request<any>, res: express.Response)
{ 
    const verificationId: string = req.params.id.trim();
    const verification: Verification|null = await VerificationMapper.read(verificationId);

    // This code is gross.
    if(verification === null)
    {
        return res.status(404).send({"error" : "Could not find verification link."});    
    }
    
    // Check to see if the verification has timedout.
    if(verification.timedOut())
    {
        return res.status(401).send({"error" : "Expired verification token."});
    }

    // Othewise verify and persist.
    verification.verify();

    await VerificationMapper.update(verification);

    return res.status(200).send( {"success": true} );
}

/**
 * Handle updating the verificaiton of a user. We need to verify that the entity that just signed up actually has control
 * over the email address they signed up as.
 * @param req Express request object
 * @param res Express response object
 */
export async function update(req: express.Request<any>, res: express.Response)
{ 
    const verificationId: string = req.params.id.trim();
    const verification: Verification|null = await VerificationMapper.read(verificationId);

    // This code is gross.
    if(verification === null)
    {
        return res.status(404).send({"error" : "Could not find verification link."});    
    }
    
    // Check to see if the verification has timedout.
    if(verification.timedOut())
    {
        return res.status(401).send({"error" : "Expired verification token."});
    }

    // Othewise verify and persist.
    verification.verify();

    await VerificationMapper.update(verification);

    return res.status(200).send( {"success": true} );
}
