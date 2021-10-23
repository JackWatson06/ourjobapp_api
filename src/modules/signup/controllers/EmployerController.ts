
/**
 * Original Author: Jack Watson
 * Created At: 10/19/2021
 * Purpose: Singing up a new employee is a vital part of our domain. This code seeks to be in charge of creating a new employee
 * in our system.
 */

// Data Mappers
import { create } from "../mappers/EmployeeMapper";

// Entities
import Employee  from "../entities/Employee";
import Email     from "../entities/UnverifiedEmail";

 // Validator
import { NewEmployee, schema } from "../validators/NewEmployeeValidator";

// External dependencies
import * as express from "express";
import Ajv from "ajv";

const ajv = new Ajv();

/**
 * api.affiliate.store - Create a brand new affiliate in the system.
 * @param req Express request object
 * @param res Express response object
 */
export async function store(req: express.Request<any>, res: express.Response)
{
    // Validate that the input coming on the request would be able to create a affiliate
    const valid = ajv.compile(schema);
    const data: NewEmployee = req.body;

    // Create the affilaite domain entity.
    if( valid(data) )
    {
        const email: Email       = new Email(data.email);
        const employee: Employee = new Employee(data, email);

        // Verify the afiiliate is who they say they are.
        await employee.verify();

        return await create(employee).then( () => {
            res.send( { "success": true } )
        }).catch( () => {
            res.send( { "error" : true } )
        });
    }
    
    // Error code did not wokr./
    return res.send( { "error" : true } );
    
    // Return a success code for the successful process ... were going to want to think of an elegant way to do this
    // throughout the application. Returning errors as well. Maybe we find something similar to fractal in PHP
}

/**
 * api.affiliate.show - Show the current affiliate to the frontend so we can grab useful properties from the url.
 * @param req Express request object
 * @param res Express response object
 */
export async function show(req: express.Request<any>, res: express.Response){ }
