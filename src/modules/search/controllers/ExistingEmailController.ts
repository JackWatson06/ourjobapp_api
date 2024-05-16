/**
 * This class servers to search through existing emails on different entities in our system. Currently the employer entity
 * is being searched.
 */

import ExistingResource from "../entities/ExistingResource";
import { find } from "../mappers/ExistingEmailMapper";
import express from "express";

export async function employerEmail(req: express.Request, res: express.Response) : Promise<void> 
{
    const email: string = req.query.email as string;

    find(email, "employers").then((data: ExistingResource) => {
        res.send( { exists: data.getExists() } );
    });
}