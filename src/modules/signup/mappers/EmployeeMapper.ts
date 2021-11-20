/**
 * Original Author: Jack Watson
 * Created Date: 10/16/2021
 * Purpose: This file serves to persiste the employee domain model to our mongodb database.
 */
import Employee from "../entities/Employee";
import PhoneToken from "../entities/PhoneToken";
import Token from "../entities/Token";

import {NewEmployee} from "../validators/NewEmployeeValidator";

import {InsertOneResult, ObjectId} from "mongodb";

import { db, MDb, now, toObjectId } from "infa/MongoDb";
import * as Collections from "Collections";

type Query = {
    id       ?: string,
    tokenId  ?: string,
    email    ?: string,
    verified ?: boolean
}

/**
 * Store the employee in the database. Return true or false if we were sucessful.... that would be cought thow if there
 * were an error maybe we just return void.
 * @param employee Employee we want to persist to memory.
 */
export async function create(employee: Employee): Promise<boolean>
{
    const mdb: MDb = db();

    // === Token ===
    const phoneToken: PhoneToken = employee.getToken();
    const token: Token = phoneToken.getToken();
    const tokenRow: Collections.Token = {
        code       : phoneToken.getCode(),
        token      : token.getToken(),
        expired_at : token.getExpiredDate(),
        created_at : now(),
        consumed   : false
    };

    const newToken: InsertOneResult<Document> = await mdb.collection("tokens").insertOne(tokenRow)

    // === Employee ===
    const data: NewEmployee = employee.getData();
    const employeeRow: Collections.Employee = { 
        ...data,
        authorized   : data.authorized.map((authorized: string) => toObjectId(authorized)),
        job_id       : data.job_id.map((job_id: string) => toObjectId(job_id)),
        nations      : data.nations      ? data.nations.map((nation: string) => toObjectId(nation)) : undefined,
        major        : data.major        ? data.major.map((major: string) => toObjectId(major)) : undefined,
        affiliate_id : data.affiliate_id ? toObjectId(data.affiliate_id) : undefined, 
        resume_id    : data.resume_id    ? toObjectId(data.resume_id) : undefined, 
        token_id     : newToken.insertedId,
        verified     : false 
    };

    return ( await mdb.collection("employees").insertOne(employeeRow)).acknowledged;

}

/**
 * Read the employee from our database. We are going to then return the employee as the domain entity.
 * @param employee Employee we want to persist to memory.
 */
export async function read(query: Query): Promise<Employee|null>
{
    // Create the affiliate
    const mdb: MDb = db();

    const employeeRow: Collections.Employee|null = await mdb
        .collection("employees")
        .findOne<Collections.Employee>({
            token_id : query.tokenId ? toObjectId(query.tokenId) : undefined,
            email    : query.email,
            verified : query.verified
        });
    
    if( employeeRow === null )
    {
        return null;
    }

    const employee: NewEmployee = {
        fname        : employeeRow.fname,
        lname        : employeeRow.lname,
        hourly_rate  : employeeRow.hourly_rate,
        commitment   : employeeRow.commitment,
        where        : employeeRow.where,
        distance     : employeeRow.distance,
        education    : employeeRow.education,
        experience   : employeeRow.experience,
        information  : employeeRow.information,
        email        : employeeRow.email,
        phone        : employeeRow.phone,

        // Map the following properties to the corresponding object id.
        job_id       : employeeRow.job_id.map((auth: ObjectId) => auth.toString()),
        authorized   : employeeRow.authorized.map((auth: ObjectId) => auth.toString()),
        affiliate_id : employeeRow.affiliate_id?.toString()
      }
    return new Employee(employee);
}

/**
 * Update the employee. Obviously this function is pretty sus since it holds domain logic but it's purpose is to update the
 * employee so that they are verified. DO NOT call this outside the controller code already in place.
 * @param query Update query we are executing.
 * @param employee Employee we want to persist to memory.
 */
export async function update(tokenId: string, employee: Employee): Promise<boolean>
{
    const mdb: MDb = db();
    
    await mdb.collection("tokens").updateOne({ _id: toObjectId(tokenId)}, {
        $set: {
            consumed: true,
        },
    })

    // Update the current employee collection
    return (await mdb.collection("employees").updateOne({token_id: toObjectId(tokenId)}, { $set: {
        verified    : true,
        verified_on : employee.getVerifiedOn()
    } })).acknowledged;
}