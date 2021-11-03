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

    // Country that the current location represents.
    private country: CountryCode;

    constructor(lat: number, long: number, country: CountryCode)
    {
        this.lat = lat;
        this.long = long;
        this.country = country;
    }

    // GETTERS for this class.
    public getLat(): number
    {
        return this.lat;
    }

    public getLong(): number
    {
        return this.long;
    }

    public getCountry(): CountryCode
    {
        return this.country;
    }
}

