
import { collections, ObjectId } from "db/MongoDb";
import { Constants } from "db/Constants";

import htmlPdf from "html-pdf";
import fs from "infa/FileSystemAdaptor";

const options: htmlPdf.CreateOptions = {
    format: "A4",
    header: {
      height: "10mm",
    },
    footer: {
      height: "10mm",
      contents: {
        default: '<span style="color: #444;float:right;">{{page}}</span><span></span>'
      }
    },
    border: {
      top: "1in",
      right: "0.5in",
      bottom: "0.5in",
      left: "0.5in"
    }
};

/**
 * Create a new contract in the file system. We use the html-pdf library for this.
 * @param contract The templated contract string that we are persisting
 * @param signupId The identifier for the parent signup resource.
 */
export async function create(contract: string, signupId: ObjectId): Promise<ObjectId>
{
    // Generate the contract from the buffer.
    const buffer: Buffer = await new Promise((resolve, reject) => {
        htmlPdf.create(contract, options).toBuffer(function(err, buffer){
            if(err)
            {
                reject(err);
            }
            
            resolve(buffer);
        });
    });

    // Write the contract in the file system.
    const fileName: string = await fs.write(fs.DOCUMENT, buffer);
    
    return (await collections.documents.insertOne({
        type        : Constants.Document.CONTRACT,
        resource    : Constants.Resource.SIGNUP,
        resource_id : signupId,
        name        : fileName,
        path        : fileName,
        extension   : "pdf",
        size        : buffer.byteLength
    })).insertedId;

}
