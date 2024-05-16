/**
 * This class holds the concept of a document. A document could be a contract, a resume, or even a photo in the future.
 * We left it generic so we can easily extend it in the future.... see the purposes constants below.
 */

import { Purpose } from "./Purpose";

export class DocumentUpload {

    private purpose: Purpose;
    private data: Buffer;
    private name: string;
    private extension: string;
    private size: number;

    constructor(
        purpose: Purpose,
        data: Buffer, 
        name: string, 
        size: number,
        extension: string)
    {
        this.purpose = purpose;
        this.data = data;
        this.name = name;
        this.size = size;
        this.extension = extension;
    }

    public getPurpose(): Purpose
    {
        return this.purpose
    }

    public getData(): Buffer
    {
        return this.data;
    }

    public getName(): string
    {
        return this.name;
    }

    public getSize(): number
    {
        return this.size;
    }

    public getExtension(): string
    {
        return this.extension;
    }
}

