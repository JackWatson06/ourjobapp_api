/**
 * Original Author: Jack Watson
 * Created Date: 10/16/2021
 * Purpose: This file serves to persiste the employee domain model to our mongodb database.
 */

import { db, now, MDb } from "infa/MongoDb";
import * as Collections from "Collections";

import Employee from "../entities/Employee";
import { InsertOneResult, ObjectId } from "mongodb";

/**
 * Store the employee in the database. Return true or false if we were sucessful.... that would be cought thow if there
 * were an error maybe we just return void.
 * @param affiliate Affiliate we want to persist to memory.
 */
export async function create(employee: Employee): Promise<boolean>
{
    const unverifiedEmail = employee.getEmail();

    // Create the employee
    const mdb: MDb = db();
    const employeeRow: Collections.Employee = { ...employee.getData() };

    const insertedEmployee: InsertOneResult<Document> = await mdb.collection("employees").insertOne(employeeRow);
    
    // Create the verification email process
    const verificationRow: Collections.Verification = {
        
        resource           : "employees",
        resource_id        : new ObjectId( insertedEmployee.insertedId.toString() ),

        verified           : false,
        token              : unverifiedEmail.getToken(),
        expired_at         : unverifiedEmail.getExpired(),
        created_at         : now()
    }

    return (await mdb.collection("verifications").insertOne(verificationRow)).acknowledged;
}
