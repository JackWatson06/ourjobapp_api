
import { getPlaceDetails } from "infa/GoogleApiAdaptor";
import * as MongoDb from "infa/MongoDb"
import * as Collections from "Collections";

import Location from "../entities/Location";
import CountryCode from "../entities/CountryCode";

const NULL_COUNTRY   = "NULL";
const NULL_LATITUDE  = 0;
const NULL_LONGITUDE = 0;

const COUNTRY_KEY = "country";

/**
 * Get the country from the google places api since it's in an array that we need to pull. If not found simply return ""
 * @param placeResult Result from google places api
 */
function extractAddressFromGooglePlaceResult(placeResult: google.maps.places.PlaceResult): string|undefined
{
    if(placeResult.address_components === undefined)
    {
        return undefined;
    }

    for(const addressComponent of placeResult.address_components)
    {   
        if(addressComponent.types.includes(COUNTRY_KEY))
        {
            return addressComponent.short_name;
        }        
    }

    return undefined;
}

/**
 * Get the place id that we are currently trying to find in our system.
 * @param placeId The place id that we are trying to find from our system.
 */
export async function read(placeId: string): Promise<Location>
{
    const db: MongoDb.MDb = MongoDb.db();

    let location: Collections.Location|null = await db.collection("locations").findOne<Collections.Location>({
        place_id: placeId
    });

    // If we can't find from the database then pull from google and cache the results for future lookups in the database.
    if(location === null)
    {   
        const googleLocation: google.maps.places.PlaceResult = await getPlaceDetails(placeId);

        // LatLng type is broke right now hence the any. The LatLng keeps on returning a fucntion when you try to get it
        // but for whatever reason it does not return as a function but rather properties on the object. So that means
        // that we are literally incapable of accessing the information without using the any keyword here.
        const latLong: any = googleLocation.geometry?.location as google.maps.LatLng;

        // Cache the location in our database for future reads.
        const newLocation = {
            place_id: placeId,
            latitutde: latLong.lat ?? NULL_LATITUDE,
            longitude: latLong.lng ?? NULL_LONGITUDE,
            country_code: extractAddressFromGooglePlaceResult(googleLocation) ?? NULL_COUNTRY
        }

        await db.collection("locations").insertOne(newLocation);
        
        return new Location(newLocation.latitutde, newLocation.longitude, new CountryCode( newLocation.country_code ) );
    }
    else
    {
        return new Location(location.latitutde, location.longitude, new CountryCode( location.country_code ));
    }

}
