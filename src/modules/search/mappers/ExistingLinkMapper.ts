/**
 * Original Author: Jack Watson
 * Created Date: 10/7/2021
 * Purpose: The purpose of this mapper is to map a generic dictionary collection to a list of return values... I was hesitant
 * about making this generic to handle any collection which has a name. But I figured it would save alot of code typing
 * initially so I decided to go with it. We will see how it turns out. Chances are I will move alot of this elsewhere in the
 * project once I have more defined boudned contexts.
 */

import {collections} from "db/MongoDb";
import ExistingResource from "../entities/ExistingResource"

type ExisitingLinkQuery = { 
    name: string;
    verified: true;
};

/**
 * Test to make sure that we only have one of a single link.
 * @param name Name of the link that we are searching for.
 */
export async function read(name: string): Promise<ExistingResource>
{
    const query: ExisitingLinkQuery = {
        "name"     : name,
        "verified" : true
    };
    
    const hasOneLink: number = await collections.affiliates.find(query).limit(1).count();
    return new ExistingResource( hasOneLink != 0 );
}
