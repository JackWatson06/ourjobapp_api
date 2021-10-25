/**
 * Original Author: Jack Watson
 * Created Date: 10/16/2021
 * Purpose: This file serves to persiste the employee domain model to our mongodb database.
 */

import { db, now, MDb } from "infa/MongoDb";
import * as Collections from "Collections";

import Employee from "../entities/Employee";
import Email from "../entities/Email";
import { InsertOneResult, ObjectId } from "mongodb";

/**
 * Store the employee in the database. Return true or false if we were sucessful.... that would be cought thow if there
 * were an error maybe we just return void.
 * @param affiliate Affiliate we want to persist to memory.
 */
export async function create(employee: Employee): Promise<boolean>
{
    // Create the employee
    const mdb: MDb = db();

    const email: Email = employee.getEmail();
    const tokenRow: Collections.Token = {
        token       : email.getToken(),
        expired_at  : email.getExpiredDate(),
        created_at  : now()
    }

    const newToken: InsertOneResult<Document> = await mdb.collection("tokens").insertOne(tokenRow)

    const employeeRow: Collections.Employee = { 
        ...employee.getData(), 
        token_id: newToken.insertedId,
        verified: false 
    };

    return ( await mdb.collection("employees").insertOne(employeeRow)).acknowledged;

}
