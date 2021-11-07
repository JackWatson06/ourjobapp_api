
import { getLocationByPlaceId } from "infa/GoogleApiAdaptor";
import * as Collections from "Collections";

import Location from "../entities/Location";
import CountryCode from "../entities/CountryCode";

/**
 * Get the place id that we are currently trying to find in our system.
 * @param placeId The place id that we are trying to find from our system.
 */
export async function read(placeId: string): Promise<Location>
{
    const location: Collections.Location = await getLocationByPlaceId(placeId);
    return new Location(location.latitutde, location.longitude, location.address, new CountryCode( location.country_code ));
}
