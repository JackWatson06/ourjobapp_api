/**
 * The major controller coordinates a request to search for a major in our data source to the front end client.
 * Right now we do the mapping directly by just calling to array.
 */

import express from "express";
import DictionaryResult from "../entities/DictionaryResult";
import { read } from "../mappers/DictionaryMapper";

/**
 * Search all of the majors that are relevant in our domain.
 * @param req Express request object
 * @param res Response object
 */
export async function index(req: express.Request, res: express.Response) : Promise<void> 
{
    const title: string = req.query.name as string;

    read(title, "majors").then((data: Array<DictionaryResult>) => {
        res.send(data);
    });
}
