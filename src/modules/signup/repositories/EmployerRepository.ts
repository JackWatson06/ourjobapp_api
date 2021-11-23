/**
 * Original Author: Jack Watson
 * Created Date: 10/24/2021
 * Purpose: The repo serves the purpose of aggregating multiple Employers to act as an in memory database.
 */
import {toEntity} from "../mappers/EmployerMapper";
import Employer from "../entities/Employer";

import {getLocationByPlaceId} from "infa/GoogleApiAdaptor";

import {db, MDb, toObjectId} from "infa/MongoDb";
import * as Collections from "Collections";

/**
 * Confirm if the employer passed in is uniuqe in the collection.
 * @param Employer Employer entity
 */
export async function getFromTokenId(tokenId: string): Promise<Employer|null>
{
    const mdb: MDb = db();

    const employerRow: Collections.Employer|null = await mdb.collection("employers").findOne<Collections.Employer>({
        token_id: toObjectId(tokenId)
    });

    if(employerRow === null)
    {
        return null;
    }

    const locationData: Collections.Location = await getLocationByPlaceId(employerRow.place_id);

    return toEntity(employerRow, locationData);
}



/**
 * Confirm if the employer passed in is uniuqe in the collection.
 * @param Employer Employer entity
 */
export async function unique(employer: Employer): Promise<boolean>
{
    const mdb: MDb = db();

    const employerRow: Collections.Employer|null = await mdb.collection("employers").findOne<Collections.Employer>({
        email    : employer.getData().email,
        verified : true
    });

    // If both of these pased then we can assume they are unique.
    return employerRow === null;
}
