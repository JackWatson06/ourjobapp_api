
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
