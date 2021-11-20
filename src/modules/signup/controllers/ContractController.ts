/**
 * Original Author: Jack Watson
 * Created Date: 11/20/2021
 * Purpose: This class will load in any contract that we want as long as the contract has not been expired, and the id pulls
 * down the correct contract.
 */
import {read} from "../mappers/ContractAccessMapper";
import ContractAccess from "../entities/ContractAccess";

import fs from "infa/FileSystemAdaptor";
import express from "express"

export async function show(req: express.Request<any>, res: express.Response)
{
    const id: string = req.params.id;
    const contract: ContractAccess|null = await read(id);

    if(contract === null)
    {
        return res.status(400).send({"error" : "Could not load contract."});
    }


    if(contract.canView())
    {
        return res.sendFile(fs.absolutePath(fs.DOCUMENT, `contracts/${contract.getFileName()}`));    
    }

    return res.status(400).send({"error" : "Ability to view contract has been expired."})
}