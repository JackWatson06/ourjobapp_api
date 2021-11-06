/**
 * Original Author: Jack Watson
 * Created Date: 11/5/2021
 * Purpose: This class serves to hold the idea of a resume in the system. 
 */

export default class Resume
{
    // Meta data about the file.

    // Internal database representation of the resume. You can't access the resume outside the system with this id
    private id: string;

    // Super secret token which will act as the key to view the resume from an eamil.
    private nameToken: string;

    // Name of the resume me uploaded
    private name: string;

    // Name of the resume me uploaded
    private webSafeToken: string;

    // Type of file the resume is.
    private type: string;

    // Size of the resume
    private size: number;

    constructor(id: string, name: string, nameToken: string, type: string, size: number)
    {
        this.id    = id;
        this.name  = name;
        this.type  = type;
        this.size  = size;
        this.nameToken = nameToken;

        this.webSafeToken = ;
    }

    // === GETTERS ===
    public getId(): string
    {
        return this.id;
    }

    public getNameToken(): string
    {
        return this.nameToken;
    }

    public getWebSafeToken(): string
    {
        return this.webSafeToken;
    }

    public getName(): string
    {
        return this.name;
    }

    public getType(): string
    {
        return this.type;
    }

    public getSize(): number
    {
        return this.size;
    }
}
