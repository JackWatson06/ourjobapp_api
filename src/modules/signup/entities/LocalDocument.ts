/**
 * This class holds the concept of a document. A document could be a contract, a resume, or even a photo in the future.
 * We left it generic so we can easily extend it in the future.... see the Types constants below.
 */

import { Purpose } from "./Purpose";

export class LocalDocument {

    private purpose: Purpose;
    private path: string;

    constructor(
        purpose: Purpose, 
        path: string)
    {
        this.purpose = purpose;
        this.path = path;
    }

    public getPurpose(): Purpose
    {
        return this.purpose;
    }

    public getPath(): string
    {
        return this.path;
    }
}

