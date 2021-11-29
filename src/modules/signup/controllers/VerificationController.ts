/**
 * Original Author: Jack Watson
 * Created Date: 11/29/2021
 * Purpose: This file will allow us to control the verificiation process which can be somewhat involved in terms of the necessary
 * steps that must be taken. This simplifies the design into a single file where in the past to much emphasis was gartnered towards
 * the invididual singup type controllers.
 */

import { find, update } from "../mappers/VerificationMapper";

import { Verification } from "../entities/Verification";

import express from "express";

export async function verify(req: express.Request, res: express.Response)
{
    const secret : string           = req.body.secret;
    const code   : number|undefined = req.body.code;

    const verification: Verification|null = await find(secret);

    if(verification === null)
    {
        return res.status(404).send({"error": "Could not find the correct signup. Please try submitting the form again!"});
    }

    if(verification.authorized(secret, code))
    {
        await update(secret, verification);

        return res.status(200).send( {"success": "Successfully verified your account!" });
    }

    return res.status(400).send( {"error": "Toke has been expired. Please try submitting the form agains! We apologize for this issue."} )
}

