/**
 * Original Author: Jack Watson
 * Created Date: 10/7/2021
 * Purpose: We need a way to show the different affiliate links that we already have in the system. This code allows us to check for
 * the existance of an affilaite before we go ahead and create their link.
 */

import { find } from "../mappers/ExistingLinkMapper";
import ExistingResource from "../entities/ExistingResource";
import express from "express";

/**
 * Search all of the affiliates links that are currently in the database since those have to be unique.
 * @param req Express request object
 * @param res Response object
 */
export async function affiliateLink(req: express.Request, res: express.Response) : Promise<void> 
{
    // Get the name stored in the request as a string.
    const name: string = req.query.name as string;

    // Call up the repository.
    find(name).then((data: ExistingResource) => {
        res.send( { exists: data.getExists() } );
    });
}
