/**
 * Original Author: Jack Watson
 * Created Date: 11/28/2021
 * Purpose: This file will map out an employer to the signup database.
 */
import { collections, ObjectId, toObjectId } from "db/MongoDb";
import { Schema } from "db/DatabaseSchema";
import { Constants } from "db/Constants";

import { NewEmployer } from "../../validators/NewEmployerValidator";

import { Employer } from "../../entities/signups/Employer";
import { ISignupMapper } from "./ISignupMapper";

export const EmployerMapper: ISignupMapper<Employer> = {

    find(signupRow: Schema.Signup): Employer
    {
        return new Employer(signupRow._id?.toString() ?? "", signupRow.data as NewEmployer);
    },

    async create(entity: Employer): Promise<ObjectId>
    {   
        return (await collections.signups.insertOne({
            _id  : toObjectId(entity.getId()),
            type : Constants.Resource.EMPLOYER,
            data : entity.getData()
        })).insertedId;
    }
}
