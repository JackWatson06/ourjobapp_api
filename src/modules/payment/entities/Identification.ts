/**
 * Original Author: Jack Watson
 * Created Date: 11/4/2021
 * Purpose: This class is a value object class to identify a user.
 */

export default class Identification
{
    private id: string;
    private phone: string;

    constructor(id: string, phone: string)
    {
        this.id = id;
        this.phone = phone;
    }

    // === GETTERS ===
    public getId(): string
    {
        return this.id;
    }

    public getPhone(): string
    {
        return this.phone;
    }

}
