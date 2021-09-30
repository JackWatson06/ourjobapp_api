
import express from "express";

/**
 * Search against a list of all the addresses in the API we are interfacing with. In this case we are 
 * interfacing with the Google Maps API.
 * @param req Express request object
 * @param res Response object
 */
export function index(req: express.Request, res: express.Response) : void 
{
    // Get the name stored in the request as a string.
    const name: string = req.query.name as string;

    // Call up the repository.
    console.log(name);
    

    // Map response from repo to dto.
    

    // Return DTO converted into JSON.
    res.send(name);
}
