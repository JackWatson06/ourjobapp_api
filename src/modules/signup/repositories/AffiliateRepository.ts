/**
 * Original Author: Jack Watson
 * Created Date: 10/24/2021
 * Purpose: The repo serves the purpose of aggregating multiple Affiliates to act as an in memory database.
 */

import { read } from "../mappers/AffiliateMapper";
import Affiliate from "../entities/Affiliate";

/**
 * Confirm if the affiliate passed in is unique.
 * @param Affiliate Affiliate entity
 */
export async function unique( affiliate: Affiliate) : Promise<boolean>
{   
    if( await read({"name" : affiliate.getName(), "verified": true}) != null )
    {   
        return false;
    }

    // If both of these pased then we can assume they are unique.
    return true;
}
