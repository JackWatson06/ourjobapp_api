/**
 * Original Author: Jack Watson
 * Created Date: 11/1/2021
 * Purpose: This class serves to search through any phone numbers in any collections that we want.
 */

import { collections } from "db/MongoDb"; 
import ExistingResource from "../entities/ExistingResource";

type ExistingPhoneQuery = { 
    phone: string
};

/**
 * Find any existing phone numbers that we have in our system.
 * @param search The phone number we are using to search
 * @param source The collection we are searching in.
 */
export async function find(search: string, source: string): Promise<ExistingResource>
{
    const query: ExistingPhoneQuery = {
        phone : search
    };

    const hasOnePhone: number = await collections[source].find(query).limit(1).count();
    return new ExistingResource( hasOnePhone != 0 );
}
