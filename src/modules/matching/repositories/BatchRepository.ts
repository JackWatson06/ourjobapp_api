import * as BatchMapper from "../mappers/BatchMapper";
import * as MongoDb from "infa/MongoDb"

import Batch from "../entities/Batch";

/**
 * Generate an id for a item in the batch collection.
 */
export function getId(): string
{
    return MongoDb.generate().toString();
}

/**
 * Get the most recent batch based on the created_at date. Yeah this is leaking from the mapper. Either that or put in custom
 * method probably doesn't matter for such a smallish project.
 */
export async function getMostRecentBatch(): Promise<Batch>
{    
    return await BatchMapper.read({}, [ 
        ["created_at", -1]
    ] );
}
