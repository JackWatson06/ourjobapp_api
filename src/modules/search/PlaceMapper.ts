import { getPlaceByName } from "../../core/infastructure/GoogleApiAdaptor";

export async function find(name: string): Promise<any>
{   
    let places: google.maps.places.AutocompleteResponse = await getPlaceByName(name);

    console.log(places);

    return null;
}
