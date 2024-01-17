/**
 * Original Author: Jack Watson
 * Created Date: 11/28/2021
 * Purpose: This file holds the default signup mapper. We will have different signup types which we may need to extend in the future.
 */

import { Verifiable } from "../../entities/signups/Verifiable";

import { ObjectId } from "db/MongoDb";
import { Schema } from "db/DatabaseSchema";

export interface ISignupMapper<T> {
    find(signupRow: Schema.Signup): Verifiable;
    create(entity: T): Promise<ObjectId>;
}
