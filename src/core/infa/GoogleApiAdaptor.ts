// Hmmmmm I feel indiferent about this we use MongoDB here so we can cache some of the results of the google api to reduce
// the amount of times we are actually querying the API. I will have to take a look at a better way to do this. Maybe I add
// some sort of cache layer on top of this to remove the gomongoDb calls inside this class.
import * as MongoDb from "../db/MongoDb";
import * as Collections from "db/DatabaseSchema";

import axios from "axios";

const GOOGLE_API_KEY: string | undefined = process.env.GOOGLE_API_KEY;

const COUNTRY_KEY    = "country";

const NULL_COUNTRY   = "NULL";
const NULL_ADDRESS   = "NULL";
const NULL_LATITUDE  = 0;
const NULL_LONGITUDE = 0;

/**
 * Find the place by the name from the Google API. This can be mapped as infastructure do to the fact that it is an 
 * information source. We shouldn't have to care if this comes from a database, or the Google Maps API. This unforutnately
 * has to be async since we 
 * @param name Name of the place we are looking for
 * 
 * @TODO Add in error handling when the API goes down. Ideally this can produce an error and warn me something is up.
 */
export async function getPlaceByName(name: string): Promise<google.maps.places.AutocompleteResponse>
{    
    return new Promise<google.maps.places.AutocompleteResponse>((resolve, reject) => {

        const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${ name }&key=${GOOGLE_API_KEY}`;

        axios.get<google.maps.places.AutocompleteResponse>(url)
        .then((response) => {
            resolve(response.data);
        })
        .catch((response) => {
            reject(null);
        });
    });
}

/**
 * This method wraps Googles place API so we can pull out more information from a placeId. This method is a little strange
 * since we return our own internal database representation of a location. The reaons being is that we want to cache the results
 * so that we do not hit the Google API to much.
 * @param placeId Place ID we want to get our Location for.
 */
export async function getLocationByPlaceId(placeId: string): Promise<Collections.Location>
{
    const db: MongoDb.MDb = MongoDb.db();

    // See if we already have the location in the database.
    let location: Collections.Location|null = await db.collection("locations").findOne<Collections.Location>({
        place_id: placeId
    });
    
    // If we can't find from the database then pull from google and cache the results for future lookups in the database.
    if(location === null)
    {   
        // Get location from the goole map
        const googleLocation: google.maps.places.PlaceResult = await (new Promise<google.maps.places.PlaceResult>((resolve, reject) => {

            const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${ placeId }&fields=address_component,adr_address,business_status,formatted_address,geometry&key=${GOOGLE_API_KEY}`;
            
            axios.get(url)
                .then((response) => {
                    resolve(response.data.result);
                })
                .catch((response) => {
                    console.error(response);
                    reject(null);
                });
        }));
        
        // LatLng type is broke right now hence the any. The LatLng keeps on returning a fucntion when you try to get it
        // but for whatever reason it does not return as a function but rather properties on the object. So that means
        // that we are literally incapable of accessing the information without using the any keyword here.
        const latLong: any = googleLocation?.geometry?.location as google.maps.LatLng ?? {
            lat: NULL_LATITUDE,
            lng: NULL_LONGITUDE
        };

        // Cache the location in our database for future reads.
        location = {
            place_id     : placeId,
            latitutde    : latLong.lat,
            longitude    : latLong.lng,
            address      : googleLocation?.formatted_address ?? NULL_ADDRESS,
            country_code : findCountryCode(googleLocation)  ?? NULL_COUNTRY,
            created_at   : MongoDb.now()
        }

        // Cache the location in the database.
        await db.collection("locations").insertOne(location);
    }

    return location;
}


/**
 * Get the country from the google places api since it's in an array that we need to pull. If not found simply return ""
 * @param placeResult Result from google places api
 */
function findCountryCode(placeResult: google.maps.places.PlaceResult|undefined): string|undefined
{
    if(placeResult === undefined || placeResult.address_components === undefined)
    {
        return undefined;
    }

    // Loop through until we find country code.
    for(const addressComponent of placeResult.address_components)
    {   
        if(addressComponent.types.includes(COUNTRY_KEY))
        {
            return addressComponent.short_name;
        }        
    }

    return undefined;
}