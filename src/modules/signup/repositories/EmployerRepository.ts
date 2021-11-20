/**
 * Original Author: Jack Watson
 * Created Date: 10/24/2021
 * Purpose: The repo serves the purpose of aggregating multiple Employers to act as an in memory database.
 */

import { read } from "../mappers/EmployerMapper";
import Employer from "../entities/Employer";

/**
 * Confirm if the employer passed in is uniuqe in the collection.
 * @param Employer Employer entity
 */
export async function unique(employer: Employer): Promise<boolean>
{
    if(await read({ "email" : employer.getData().email, "verified": true}) != null )
    {
        return false;
    }

    return true;
}
