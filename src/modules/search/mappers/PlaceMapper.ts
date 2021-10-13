/**
 * Original Author: Jack Watson
 * Created Date: 10/7/2021
 * Purpose: The purpose of this class is to search against the google api properties section. Then we will return a list of
 * mapping properties. 
 */

import { getPlaceByName } from "../../../core/infa/GoogleApiAdaptor";
import Place from "../entities/Place";

export async function read(name: string): Promise<Array<Place>>
{   
    let places: google.maps.places.AutocompleteResponse = await getPlaceByName(name);

    return places.predictions.map((prediction:  google.maps.places.AutocompletePrediction) => {
        return new Place( prediction.place_id, prediction.description);
    });
}