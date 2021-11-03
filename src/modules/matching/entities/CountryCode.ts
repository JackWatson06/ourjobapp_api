/**
 * Original Author: Jack Watson
 * Created Date: 11/3/2021
 * Purpose: A country code represents the two letter characters for a country. This is useful to have since google maps
 * returns there countries as two level codes. This class is a value object.
 */

export default class CountryCode
{
    private countryCode: string;

    constructor(countryCode: string)
    {
        this.countryCode = countryCode;
    }

    /**
     * Get the country code for this value object
     */
    public getCountryCode()
    {
        return this.countryCode;
    }
}



