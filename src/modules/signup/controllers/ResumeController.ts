// Data Mappers
import * as ResumeMapper from "../mappers/ResumeMapper";
import fs from "infa/FileSystemAdaptor";

// Entities
import Resume from "../entities/Resume";

// External dependencies
import * as express from "express";
import * as fileUpload from "express-fileupload";

/**
 * Confirm that the file we are uploading matches the correct criteria.
 * @param file File we are uploading
 */
function valid(file: fileUpload.UploadedFile): boolean
{
    if(file.size > 2097152 && !["test"].includes( file.mimetype ) )
    {
        return false;
    }

    return true;
}

/**
 * Upload the file to the resumes directory.
 * @param req Request object for express
 * @param res Response object for express
 */
export async function store(req: express.Request, res: express.Response)
{
    // Validate that the input coming on the request would be able to create a affiliate. File must be called resume
    console.log(req.files);
    const file: fileUpload.UploadedFile|undefined = req.files?.resume as fileUpload.UploadedFile|undefined;

    if(file != undefined && valid(file))
    {
        const id: string = ResumeMapper.generate();
        const resume: Resume = new Resume(id, file.md5, file.name, file.mimetype, file.size);

        fs.write(fs.DOCUMENT, file.data, `resume/${resume.getNameToken()}`);
        ResumeMapper.create(resume);
    }

    // Error code did not work./
    return res.status(400).send( { "error" : true } );
}