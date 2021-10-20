/**
 * Original Author: Jack Watson
 * Created Date: 10/7/2021
 * Purpose: The purpose of this mapper is to map a generic dictionary collection to a list of return values... I was hesitant
 * about making this generic to handle any collection which has a name. But I figured it would save alot of code typing
 * initially so I decided to go with it. We will see how it turns out. Chances are I will move alot of this elsewhere in the
 * project once I have more defined boudned contexts.
 */

import * as MongoDb from "infa/MongoDb";
import ExistingLink from "../entities/ExistingLink";

type ExisitingLinkQuery = { 
    name: RegExp;
};

/**
 * Test to make sure that we only have one of a single link.
 * @param name Name of the link that we are searching for.
 */
export async function read(name: string): Promise<ExistingLink>
{
    const db: MongoDb.MDb = MongoDb.db();
    const query: ExisitingLinkQuery = {
        "name": new RegExp(`^${name}.*`)
    };

    const hasOneLink: number = await db.collection("affiliates").find(query).limit(1).count();
    return new ExistingLink( hasOneLink === 0 );
}
