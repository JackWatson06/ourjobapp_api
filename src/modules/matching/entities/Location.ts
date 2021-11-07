/**
 * Original Author: Jack Watson
 * Created Date: 11/1/2021
 * Purpose: A location in our systems represents a mapping between a place id and the corresponding lat, long, and country data.
 */

import CountryCode from "./CountryCode";

export default class Location
{
    // Latitude of the current location
    private lat: number;

    // Longitude of the current location
    private long: number;

    // The locations address
    private address: string;

    // Country that the current location represents.
    private country: CountryCode;

    constructor(lat: number, long: number, address: string, country: CountryCode)
    {
        this.lat = lat;
        this.long = long;
        this.country = country;
        this.address = address;
    }

    // === GETTERS ===
    public getLat(): number
    {
        return this.lat;
    }

    public getLong(): number
    {
        return this.long;
    }

    public getAddress(): string
    {
        return this.address;
    }

    public getCountry(): CountryCode
    {
        return this.country;
    }
}

