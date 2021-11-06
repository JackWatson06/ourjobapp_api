// Data Mappers
import * as ResumeMapper from "../mappers/ResumeMapper";

// Entities
import Resume from "../entities/Resume";

// Validators
import validate from "../validators/ResumeValidator";

// View
import transform from "../views/ResumeView";

// External dependencies
import * as express from "express";
import * as fileUpload from "express-fileupload";
import fs from "infa/FileSystemAdaptor";

/**
 * Upload the file to the resumes directory.
 * @param req Request object for express
 * @param res Response object for express
 */
export async function store(req: express.Request, res: express.Response)
{
    // Validate that the input coming on the request would be able to create a affiliate. File must be called resume
    const file: fileUpload.UploadedFile|undefined = req.files?.resume as fileUpload.UploadedFile|undefined;

    if(file != undefined && validate(file))
    {
        const id: string = ResumeMapper.generate();
        const resume: Resume = new Resume(id, file.name, file.md5, file.mimetype, file.size);

        fs.write(fs.DOCUMENT, file.data, `resumes/${resume.getNameToken()}`);
        ResumeMapper.create(resume);

        return res.status(200).send( transform(resume) );
    }

    // Error code did not work./
    return res.status(400).send( { "error" : true } );
}