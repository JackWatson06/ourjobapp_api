/**
 * Original Author: Jack Watson
 * Created Date: 12/1/2021
 * Purpose: This function will see if we have any duplicate phone numbers in our system.
 */

import { find } from "../mappers/ExistingPhoneMapper";
import ExistingResource from "../entities/ExistingResource";
import express from "express";

export async function employeePhone(req: express.Request, res: express.Response) : Promise<void> 
{
    const phone: string = req.query.phone as string;

    // Call up the repository.
    find(phone, "employees").then((data: ExistingResource) => {
        res.send( { exists: data.getExists() } );
    });
}