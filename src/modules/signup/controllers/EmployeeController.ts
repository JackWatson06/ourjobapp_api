/**
 * Original Author: Jack Watson
 * Created At: 11/28/2021
 * Purpose: This class will store a new employee using our signup system that we have in place.
 * 
 */
// Data Mappers
import { create } from "../mappers/SignupMapper";

// Entities
import { Signup }         from "../entities/Signup";
import { Employee }       from "../entities/signups/Employee";
import { DocumentUpload } from "../entities/DocumentUpload";
import { Purpose }        from "../entities/Purpose";
import { Token }          from "../entities/Token";

// Validator
import { NewEmployee, schema } from "../validators/NewEmployeeValidator";
import { validResume }         from "../validators/ResumeValidator";

// External dependencies
import { Notification } from "notify/Notification";
import { HandlebarsAdaptor } from "template/HandlebarsAdaptor";
import express from "express";
import * as fileUpload from "express-fileupload";
import Ajv from "ajv";
 
/**
 * Store a new employee in the signup system that we have.
 * @param req Express request
 * @param res Express response
 */
export async function store(req: express.Request, res: express.Response)
{
    // Validate that the input coming on the request would be able to create a employee
    const ajv = new Ajv();
    const valid = ajv.compile(schema);

    const data: NewEmployee = req.body;
    const resume: fileUpload.UploadedFile|undefined = req.files?.resume as fileUpload.UploadedFile|undefined;
        
    // Create the employee domain entity.
    if( valid(data) )
    {
        const token: Token     = new Token();
        const entity: Employee = new Employee(data);
        const signup: Signup   = new Signup(entity, token);

        await signup.sendVerification(new Notification(), new HandlebarsAdaptor());

        // Add the document upload to the signup.
        if(resume != undefined && validResume(resume))
        {
            signup.uploadDocument(new DocumentUpload(Purpose.RESUME, resume.data, resume.name, resume.size, resume.mimetype));
        }

        try
        {
            const id: string|null = await create(signup);
            return res.status(200).send({ id: id });
        }
        catch(err)
        {
            return res.status(503).send({"error": "Could not create signup."})
        }
    }

    return res.status(400).send( { "error" : "Data invalid." } );
}
