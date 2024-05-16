/**
 * The address that we are mapping to the domain. Note that the address pulls from the GoogleApiAdaptor. This
 * adaptor has a built in cache to prevent from querying against the API multiple times. We store this cache in MongoDB
 */
import { Schema } from "db/DatabaseSchema";
import { getLocationByPlaceId } from "infra/GoogleApiAdaptor";

import { Address } from "../entities/Address";

/**
 * Read the current adddress by loading in the placeId.
 * @param placeId Place id which represents the google representation of the identifier for a place.
 */
export async function findAddress(placeId: string): Promise<Address>
{
    const location: Schema.Location = await getLocationByPlaceId(placeId);
    return new Address(location.address);
}
