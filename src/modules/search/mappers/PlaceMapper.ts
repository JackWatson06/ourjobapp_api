/**
 * Original Author: Jack Watson
 * Created Date: 10/7/2021
 * Purpose: The purpose of this class is to search against the google api properties section. Then we will return a list of
 * mapping properties. 
 */

import { getPlaceByName } from "../../../core/infra/GoogleApiAdaptor";
import DictionaryResult from "../entities/DictionaryResult";

export async function read(name: string): Promise<Array<DictionaryResult>>
{   
    const places: google.maps.places.AutocompleteResponse = await getPlaceByName(name);

    return places.predictions.map((prediction:  google.maps.places.AutocompletePrediction) => {
        return new DictionaryResult( prediction.place_id, prediction.description);
    });
}