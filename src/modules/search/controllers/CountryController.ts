/**
 * We need to search all of the coutnries in the entire world for part of our domain.
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
    const title: string = req.query.name as string;

    read(title, "countries").then((data: Array<DictionaryResult>) => {
        res.send(data);
    });
}
