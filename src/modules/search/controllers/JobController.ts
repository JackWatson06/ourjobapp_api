/**
 * Original Author: Jack Watson
 * Created Date: 10/7/2021
 * Purpose: The prupose of this class is to allow the client to search for a job that is stored in our data source.
 */
import express from "express";
import DictionaryResult from "../entities/DictionaryResult";
import { read } from "../mappers/DictionaryMapper";

/**
 * Search all of the jobs that are in our current domain.
 * @param req Express request object
 * @param res Response object
 * 
 * @TODO Implement JobDTO
 */
export async function index(req: express.Request, res: express.Response) : Promise<void> 
{
    // Get the name stored in the request as a string.
    const title: string = req.query.name as string;

    // Call up the repository.
    read(title, "jobs").then((data: Array<DictionaryResult>) => {
        res.send(data);
    });
}
