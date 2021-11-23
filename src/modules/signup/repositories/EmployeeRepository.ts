/**
 * Original Author: Jack Watson
 * Created Date: 10/24/2021
 * Purpose: The repo serves the purpose of aggregate multiple employee's to act as an in memory collection of the employees.
 */

import Employee from "../entities/Employee";
import {toEntity} from "../mappers/EmployeeMapper";

import {db, MDb, toObjectId} from "infa/MongoDb";
import * as Collections from "Collections";

/**
 * Get the affiliate from the persistance layer.
 */
export async function getFromTokenId( tokenId: string) : Promise<Employee|null>
{   
    const mdb: MDb = db();

    // We need to turn the query into mongodb language.
    const employeeRow: Collections.Employee|null = await mdb.collection("employees").findOne<Collections.Employee>({
            token_id : toObjectId(tokenId),
        });

    return employeeRow === null ? employeeRow : toEntity(employeeRow);
}

/**
 * Confirm the employee email is unique against the current collection.
 * @param Employee Employee entity
 */
export async function unique( employee: Employee) : Promise<boolean>
{
    const mdb: MDb = db();

    const employeeRow: Collections.Employee|null = await mdb.collection("employees").findOne<Collections.Employee>({
        phone : employee.getData().phone,
        verified: true
    });

    // If both of these pased then we can assume they are unique.
    return employeeRow === null;
}
