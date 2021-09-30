import { getPlaceByName } from "../../core/infastructure/GoogleApiAdaptor";
import Place from "./Place";

export async function read(name: string): Promise<Array<Place>>
{   
    let places: google.maps.places.AutocompleteResponse = await getPlaceByName(name);

    return places.predictions.map((prediction:  google.maps.places.AutocompletePrediction) => {
        return new Place( prediction.place_id, prediction.description);
    });
}
