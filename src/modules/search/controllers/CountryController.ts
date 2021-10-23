/**
 * Original Author: Jack Watson
 * Created Date: 10/7/2021
 * Purpose: We need to search all of the coutnries in the entire world for part of our domain.
 */

import express from "express";
import DictionaryResult from "../entities/DictionaryResult";
import { read } from "../mappers/DictionaryMapper";

/**
 * Search all of the countries in our domain.
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
    read(title, "countries").then((data: Array<DictionaryResult>) => {
        res.send(data);
    });
}
