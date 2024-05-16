/**
 * The purpose of this class is to have a endpoint for our API which allows the client to search for a sepecifc
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
 */
export async function index(req: express.Request, res: express.Response) : Promise<void> 
{
    const title: string = req.query.name as string;

    read(title, "charities").then((data: Array<DictionaryResult>) => {
        res.send(data);
    });
}
