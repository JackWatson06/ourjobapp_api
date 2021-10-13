/**
 * Original Author: Jack Watson
 * Created Date: 9/25/2021
 * Purpose: The purpose of this class is to hold the idea of a place that we just searched with some service in the backend.
 */

export default class Place
{

    private place: string;
    private description: string;

    constructor(place: string, description: string)
    {
        this.place  = place;
        this.description = description;
    }

    public getName(): string
    {
        return this.place
    }

    public getCoordinates(): string
    {
        return this.description
    }
}
