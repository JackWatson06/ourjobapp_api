
import express from "express";
import ExistingResource from "../entities/ExistingResource";
import { read } from "../mappers/ExistingEmailMapper";


export async function affiliate(req: express.Request, res: express.Response) : Promise<void> 
{
    const name: string = req.query.name as string;

    // This exposes the database table. Think about that.
    read(name, "affiliates").then((data: ExistingResource) => {
        res.send( { result: data.getExists() } );
    });
}

export async function employer(req: express.Request, res: express.Response) : Promise<void> 
{
    const name: string = req.query.name as string;

    read(name, "employers").then((data: ExistingResource) => {
        res.send( { result: data.getExists() } );
    });
}


export async function employee(req: express.Request, res: express.Response) : Promise<void> 
{
    const name: string = req.query.name as string;

    read(name, "employees").then((data: ExistingResource) => {
        res.send( { result: data.getExists() } );
    });
}
