import express from "express";
import Place from "../entities/Place";
import { read } from "../mappers/PlaceMapper";

/**
 * Search against a list of all the addresses in the API we are interfacing with. In this case we are 
 * interfacing with the Google Maps API.
 * @param req Express request object
 * @param res Response object
 * 
 * @TODO Implement the PlaceDTO and map the Place correctly on the DTO. The reason being is that the view of this endpoint
 * may be different than the actual Domain model. Right now it is not (obviously) so it may be redundent, but worth consdiering.
 */
export async function index(req: express.Request, res: express.Response) : Promise<void> 
{
    // Get the name stored in the request as a string.
    const name: string = req.query.name as string;

    // Call up the repository.
    read(name).then((data: Array<Place>) => {
        res.send(data);
    });
}
