import axios from "axios";


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
    const GOOGLE_API_KEY: string | undefined = process.env.GOOGLE_API_KEY;
    
    return new Promise<google.maps.places.AutocompleteResponse>((resolve, reject) => {

        const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${ name }&key=${GOOGLE_API_KEY}`;

        axios.get<google.maps.places.AutocompleteResponse>(url)
        .then((response) => {
            resolve(response.data)
        });
    });
}
