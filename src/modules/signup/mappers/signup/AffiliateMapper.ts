/**
 * Original Author: Jack Watson
 * Created Date: 11/28/2021
 * Purpose: This file is in charge of mapping the signup type for affiliates. All of the signup mappers use the same table
 * to map out the inheritance structure that
 */

import { collections, ObjectId } from "db/MongoDb";
import { Schema } from "db/DatabaseSchema";
import { Constants } from "db/Constants";

import { Affiliate } from "../../entities/signups/Affiliate";
import { NewAffiliate } from "../../validators/NewAffiliateValidator";

import { ISignupMapper } from "./ISignupMapper";

/**
 * Create a new affiliate signup.
 * @param entity The signup type for the Affiliate
 * @param signupRow The row that is currently being put into the database. We need to adorn this with 
 */
export const AffiliateMapper: ISignupMapper<Affiliate> = {

    find(signupRow: Schema.Signup): Affiliate
    {
        return new Affiliate(signupRow.data as NewAffiliate);
    },

    async create(entity: Affiliate): Promise<ObjectId>
    {   
        return (await collections.signups.insertOne({
            type: Constants.Resource.AFFILIATE,
            data: entity.getData()
        })).insertedId;
    }
}
