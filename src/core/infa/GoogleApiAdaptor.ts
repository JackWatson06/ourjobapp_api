import axios from "axios";

const GOOGLE_API_KEY: string | undefined = process.env.GOOGLE_API_KEY;

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
            console.error(response);
            reject(null);
        });
    });
}


export async function getPlaceDetails(placeId: string): Promise<google.maps.places.PlaceResult>
{
 
    return new Promise<google.maps.places.PlaceResult>((resolve, reject) => {

        const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${ placeId }&fields=address_component,adr_address,business_status,formatted_address,geometry&key=${GOOGLE_API_KEY}`;

        axios.get(url)
        .then((response) => {
            resolve(response.data.result);
        })
        .catch((response) => {
            console.error(response);
            reject(null);
        });
    });
}

