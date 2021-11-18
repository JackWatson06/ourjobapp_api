/**
 * Original Author: Jack Watson
 * Created Date: 10/24/2021
 * Purpose: The repo serves the purpose of aggregate multiple employee's to act as an in memory collection of the employees.
 */

import { read } from "../mappers/EmployeeMapper";
import Employee from "../entities/Employee";

/**
 * Confirm the employee email is unique against the current collection.
 * @param Employee Employee entity
 */
export async function unique( employee: Employee) : Promise<boolean>
{
    if( await read({ "email" : employee.getData().email, "verified": true}) != null )
    {
        return false;
    }

    return true;
}
