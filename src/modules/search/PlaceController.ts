import express from "express";
import Place from "./Place";
import { read } from "./PlaceMapper";

/**
 * Search against a list of all the addresses in the API we are interfacing with. In this case we are 
 * interfacing with the Google Maps API.
 * @param req Express request object
 * @param res Response object
 */
export async function index(req: express.Request, res: express.Response) : Promise<void> 
{
    // Get the name stored in the request as a string.
    const name: string = req.query.name as string;

    // Call up the repository.
    read(name).then((data: Array<Place>) => {
        res.send(data);
    });
    
    // Map the places tot their respective DTO
    // for(const place in places)
    // {
    //     console.log(place);
    // }
    
    // Return DTO converted into JSON.
}
