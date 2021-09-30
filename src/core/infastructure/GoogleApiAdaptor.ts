import axios from "axios";

const GOOGLE_API_KEY: string = "";


/**
 * Find the place by the name from the Google API. This can be mapped as infastructure do to the fact that it is an 
 * information source. We shouldn't have to care if this comes from a database, or the Google Maps API. This unforutnately
 * has to be async since we 
 * @param name Name of the place we are looking for
 */
export async function getPlaceByName(name: string): Promise<google.maps.places.AutocompleteResponse>
{
    return new Promise<google.maps.places.AutocompleteResponse>((resolve, reject) => {

        const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${ name }&key=${GOOGLE_API_KEY}`;

        axios.get<google.maps.places.AutocompleteResponse>(url)
        .then((response) => {
            resolve(response.data)
        });
    });
}
