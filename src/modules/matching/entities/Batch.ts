/**
 * A batch represents a time when we matched all of the employers with their coresponding employees.
 */

export default class Batch
{
    private id: string;

    constructor(id: string)
    {
        this.id        = id;
    }

    public getId(): string
    {
        return this.id;
    }
}
