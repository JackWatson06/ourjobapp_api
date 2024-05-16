/**
 * The frontend needs a way to determine which affiliate link the user clicked on. Here we get the affiliate cookie
 * entity from the database and use that to return a response with the affiliates identifiers.
 */

import express from "express";

import { read } from "../mappers/CookieMapper"; 
import AffiliateCookie from "../entities/AffiliateCookie";

/**
 * Show the affilaite cookie that we will want to use on the front end. We do not generate the cookie here but we use the
 * id to return to the frontend.
 * @param req Express request param
 * @param res Express response param
 */
export function show(req: express.Request, res: express.Response)
{
    const name: string = req.query.name as string;

    read(name).then((affiliateCookie: AffiliateCookie) => {
        return res.status(200).send( {"id" : affiliateCookie.getId()} )
    }).catch(() => {
        return res.status(404).send( {"error": "Name not valid"} )
    });
}
