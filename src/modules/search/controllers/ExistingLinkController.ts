/**
 * Original Author: Jack Watson
 * Created Date: 10/7/2021
 * Purpose: We need a way to show the different affiliate links that we already have in the system. This code allows us to check for
 * the existance of an affilaite before we go ahead and create their link.
 */

import express from "express";
import ExistingLink from "../entities/ExistingLink";
import { read } from "../mappers/ExistingLinkMapper";

/**
 * Search all of the charities that are allowed in our domain.
 * @param req Express request object
 * @param res Response object
 * 
 * @TODO Implement CharityDTO
 */
export async function show(req: express.Request, res: express.Response) : Promise<void> 
{
    // Get the name stored in the request as a string.
    const name: string = req.query.name as string;

    // Call up the repository.
    read(name).then((data: ExistingLink) => {
        res.send(data.getExists());
    });
}
