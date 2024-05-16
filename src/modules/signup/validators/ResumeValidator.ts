/**
 * This class simply validates a resume upload.
 */

import * as fileUpload from "express-fileupload";

//https://stackoverflow.com/questions/4212861/what-is-a-correct-mime-type-for-docx-pptx-etc
const TYPES = [
    "application/msword",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.template",
    "application/vnd.ms-word.document.macroEnabled.12",
    "application/vnd.ms-word.template.macroEnabled.12",
    "application/pdf",
    "text/plain"
]

const LIMIT = 5242880;

/**
 * Validate a file we just uploaded.
 * @param file File we just uploaded from express-fileupload
 */
export function validResume(file: fileUpload.UploadedFile): boolean
{
    if(file.size > LIMIT && !TYPES.includes( file.mimetype ) )
    {
        return false;
    }

    return true;
}
