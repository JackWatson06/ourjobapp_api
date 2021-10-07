/**
 * Original Author: Jack Watson
 * Created Date: 10/7/2021
 * Purpose: The purpose of this class is to have a endpoint for our API which allows the client to search for a sepecifc
 * charity that they want.
 */

import express from "express";
import DictionaryResult from "../entities/DictionaryResult";
import { read } from "../mappers/DictionaryMapper";

/**
 * Search all of the charities that are allowed in our domain.
 * @param req Express request object
 * @param res Response object
 * 
 * @TODO Implement CharityDTO
 */
export async function index(req: express.Request, res: express.Response) : Promise<void> 
{
    // Get the name stored in the request as a string.
    const title: string = req.query.name as string;

    // Call up the repository.
    read(title, "charities").then((data: Array<DictionaryResult>) => {
        res.send(data);
    });
}
