/**
 * The puropse of this job gropu controller is to provide an endpoint for a client to search for job groups
 * These job groups are associated with specific job. The actually relationship is stored in the jobs collection
 */

import express from "express";
import DictionaryResult from "../entities/DictionaryResult";
import { read } from "../mappers/DictionaryMapper";

/**
 * Search all of the job groups that are allowed in our domain.
 * @param req Express request object
 * @param res Response object
 */
export async function index(req: express.Request, res: express.Response) : Promise<void> 
{
    const title: string = req.query.name as string;

    read(title, "job_groups").then((data: Array<DictionaryResult>) => {
        res.send(data);
    });
}
