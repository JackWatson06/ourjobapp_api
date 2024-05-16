import express from "express";
import DictionaryResult from "../entities/DictionaryResult";
import { read } from "../mappers/PlaceMapper";

/**
 * Search against a list of all the addresses in the API we are interfacing with. In this case we are 
 * interfacing with the Google Maps API.
 * @param req Express request object
 * @param res Response object
 */
export async function index(req: express.Request, res: express.Response) : Promise<void> 
{
    const name: string = req.query.name as string;

    read(name).then((data: Array<DictionaryResult>) => {
        res.send(data);
    });
}
