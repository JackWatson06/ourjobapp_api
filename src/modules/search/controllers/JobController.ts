/**
 * The prupose of this class is to allow the client to search for a job that is stored in our data source.
 */
import express from "express";
import DictionaryResult from "../entities/DictionaryResult";
import { read } from "../mappers/DictionaryMapper";

/**
 * Search all of the jobs that are in our current domain.
 * @param req Express request object
 * @param res Response object
 */
export async function index(req: express.Request, res: express.Response) : Promise<void> 
{
    const title: string = req.query.name as string;

    read(title, "jobs").then((data: Array<DictionaryResult>) => {
        res.send(data);
    });
}
