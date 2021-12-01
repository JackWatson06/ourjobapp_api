
import express from "express";
import ExistingResource from "../entities/ExistingResource";
import { read } from "../mappers/ExistingEmailMapper";

export async function employer(req: express.Request, res: express.Response) : Promise<void> 
{
    const email: string = req.query.email as string;

    read(email, "employers").then((data: ExistingResource) => {
        res.send( { result: data.getExists() } );
    });
}

export async function employee(req: express.Request, res: express.Response) : Promise<void> 
{
    const email: string = req.query.email as string;

    read(email, "employees").then((data: ExistingResource) => {
        res.send( { result: data.getExists() } );
    });
}
