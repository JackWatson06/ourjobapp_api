
/**
 * Original Author: Jack Watson
 * Created At: 10/19/2021
 * Purpose: Singing up a new employee is a vital part of our domain. This code seeks to be in charge of creating a new employee
 * in our system.
 */

// Data Mappers
import { create, read, update } from "../mappers/EmployeeMapper";
import { read as readProof } from "../mappers/ProofMapper";
import { ObjectId } from "mongodb";

// Entities
import Employee  from "../entities/Employee";
import Email     from "../entities/Email";
import Token     from "../entities/Token";
import Proof     from "../entities/Proof";

 // Validator
import { NewEmployee, schema } from "../validators/NewEmployeeValidator";

// Repository
import { unique } from "../repositories/EmployeeRepository";

// External dependencies
import * as express from "express";
import Ajv from "ajv";

/**
 * signup.employee.store - Create a brand new employee in our system.
 * @param req Express request object
 * @param res Express response object
 */
export async function store(req: express.Request<any>, res: express.Response)
{
    const ajv = new Ajv();

    // Validate that the input coming on the request would be able to create a employee
    const valid = ajv.compile(schema);
    const data: NewEmployee = req.body;   

    // Create the employee domain entity.
    if( valid(data) )
    {
        const email: Email       = new Email(data.email, Token.generate());
        const employee: Employee = new Employee(data, email);

        await create(employee).catch( (err) => {
            console.error(err);
            res.status(400).send( { "error" : true } )
        });

        // Verify the afiiliate is who they say they are.
        await employee.verify();

        return res.status(200).send( { "success": true } )
    }

    console.log(valid.errors);
    

    // Error code did not work
    return res.status(400).send( { "error" : true } );
}

/**
 * signup.employee.resend - Resend the employees verification link
 * @param req Express request object
 * @param res Express response object
 */
export async function resend(req: express.Request<any>, res: express.Response)
{
    const id: string = req.body.id;
    
    // Pull the affiliate from the database.
    const employee: Employee|null = await read({ _id: new ObjectId( id ) });
    if(employee === null)
    {
        return res.status(400).send( { "error": "No employee found" } )
    }

    const sent: boolean = await employee.verify();

    if(sent)
    {
        return res.status(200).send( { "success": true } )
    }

    return res.status(400).send( { "error": true } )
}

/**
 * signup.employee.verify - Verify the employee to be using our system.
 * @param req Express request object
 * @param res Express response object
 */
export async function verify(req: express.Request<any>, res: express.Response)
{
    
    const token: string = req.body.token;

    const proof: Proof|null = await readProof(token);

    // Make sure that we can find the token
    if(proof === null)
    {
        return res.status(404).send({"error" : "Invalid verification link."});    
    }

    // Pull the affiliate from the database.,
    const employee: Employee|null = await read({ token_id: new ObjectId( proof.getId()) });

    // Double check that the affiliate exists.
    if(employee === null)
    {
        return res.status(404).send({"error" : "Invalid verification link."});    
    }

    // If not unique then throw an error
    if( !( await unique( employee )) )
    {
        return res.status(400).send({"error" : "Employee with Email already been authenticated."});    
    }

    // Othewise verify and persist.
    const authorized: boolean = employee.authorize();

    if(authorized)
    {
        await update({ token_id: new ObjectId( proof.getId())}, employee);
        return res.status(200).send( {"success": true} );
    }

    return res.status(400).send( {"error": "Token not valid"} )
}
