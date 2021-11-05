/**
 * Original Author: Jack Watson
 * Created Date: 11/4/2021
 * Purpose: This class is a value object class to identify a user.
 */

export default class Identification
{
    private id: string;
    private email: string;

    constructor(id: string, email: string)
    {
        this.id = id;
        this.email = email;
    }

    // === GETTERS ===
    public getId(): string
    {
        return this.id;
    }

    public getEmail(): string
    {
        return this.email;
    }

}
