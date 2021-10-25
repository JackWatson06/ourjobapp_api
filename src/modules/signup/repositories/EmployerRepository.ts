/**
 * Original Author: Jack Watson
 * Created Date: 10/24/2021
 * Purpose: The repo serves the purpose of aggregating multiple Employers to act as an in memory database.
 */

import { read } from "../mappers/EmployerMapper";
import Employer from "../entities/Employer";
import Email from "../entities/Email";

/**
 * Confirm if the employer passed in is uniuqe in the collection.
 * @param Employer Employer entity
 */
export async function unique( employer: Employer) : Promise<boolean>
{
    const email: Email = employer.getEmail();

    if( await read({ "email" : email.getEmail(), "verified": true}) != null )
    {
        return false;
    }

    return true;
}
