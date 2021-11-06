
import Resume from "../entities/Resume";

import * as MongoDb from "infa/MongoDb";
import * as Collections from "Collections";

/**
 * Generate a new id since we are going to return this in the view.
 */
export function generate(): string
{
    return MongoDb.generate().toString();
}

/**
 * Create a new resume in the database.
 * @param resume Resume we just added to the database
 */
export async function create(resume: Resume): Promise<boolean>
{
    const db: MongoDb.MDb = MongoDb.db();

    // === Resume ===
    const resumeRow: Collections.Resume = {
        name     : resume.getName(),
        token    : resume.getNameToken(),
        web_token: resume.getWebSafeToken(),
        type     : resume.getType(),
        size     : resume.getSize()
    };

    return( await db.collection("resumes").insertOne(resumeRow)).acknowledged;
}