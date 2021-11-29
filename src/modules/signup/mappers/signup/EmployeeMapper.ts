/**
 * Original Author: Jack Watson
 * Created Date: 11/28/2021
 * Purpose: This file is in charge of mapping the signup type for employees. All of the signup mappers use the same table
 * to map out the inheritance structure that.
 */
import { collections, ObjectId } from "db/MongoDb";
import { Schema } from "db/DatabaseSchema";
import { Constants } from "db/Constants";

import { NewEmployee } from "../../validators/NewEmployeeValidator";

import { Employee } from "../../entities/signups/Employee";
import { ISignupMapper } from "./ISignupMapper";

/**
 * Create a new employee signup
 * @param entity The signup type for the Employee
 * @param signupRow The row that is currently being put into the database
 */
export const EmployeeMapper: ISignupMapper<Employee> = {

    find(signupRow: Schema.Signup): Employee
    {
        return new Employee(signupRow.data as NewEmployee);
    },

    async create(entity: Employee): Promise<ObjectId>
    {   
        return (await collections.signups.insertOne({
            type: Constants.Resource.EMPLOYEE,
            data: entity.getData()
        })).insertedId;
    }
}
