/**
 * This class is in charge of mapping a regular document to the persistance layer.
 */

import fs from "infra/FileSystemAdaptor";
import { collections, ObjectId } from "db/MongoDb";
import { Constants } from "db/Constants";

import { DocumentUpload } from "../../entities/DocumentUpload";
import { Purpose } from "../../entities/Purpose";
import { LocalDocument } from "../../entities/LocalDocument";

type ConstantMapping = {
    [constant: number]: Purpose
}

/**
 * Map the local documents stored in the persistance layer to our in memory versions of them.
 * @param signupId The signup identifier that we use to pull out the correct documents
 */
export async function find(signupId: ObjectId): Promise<Array<LocalDocument>>
{
    const mapping: ConstantMapping = {
        [Constants.Document.CONTRACT]: Purpose.CONTRACT,
        [Constants.Document.RESUME]: Purpose.RESUME,
    }

    return (await collections.documents.find({
        resource    : Constants.Resource.SIGNUP,
        resource_id : signupId
    })).map<LocalDocument>(
        (document) => new LocalDocument(mapping[document.type], document.path)
    ).toArray();
}

/**
 * Create a new document in the system during our saving to persistance.
 * @param documentUpload The document that we just uploaded
 * @param signupId The identifier for the parent object.
 */
export async function create(documentUpload: DocumentUpload, signupId: ObjectId): Promise<ObjectId>
{
    const path: string = await fs.write(fs.DOCUMENT, documentUpload.getData());

    return (await collections.documents.insertOne({
        type       : documentUpload.getPurpose() as number, // <== This right here is actually a mapping of domain to persistance. Not the best but works for now.
        resource   : Constants.Resource.SIGNUP,
        resource_id: signupId,
        name       : documentUpload.getName(),
        size       : documentUpload.getSize(),
        extension  : documentUpload.getExtension(),
        path       : path
    })).insertedId;
}

