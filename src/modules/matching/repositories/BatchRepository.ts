import * as BatchMapper from "../mappers/BatchMapper";

import { collections, generate} from "db/MongoDb"
import { Schema } from "db/DatabaseSchema"

import Batch from "../entities/Batch";

/**
 * Generate an id for a item in the batch collection.
 */
export function getId(): string
{
    return generate().toString();
}

/**
 * Get the most recent batch based on the created_at date. Yeah this is leaking from the mapper. Either that or put in custom
 * method probably doesn't matter for such a smallish project.
 */
export async function getMostRecentBatch(): Promise<Batch>
{    
    const batchRow: Schema.Batch|null = await collections.batches.find({}).sort([ 
        ["created_at", -1]
    ]).limit(1).next();

    if(batchRow === null)
    {
        throw "Could not find most recent batch row."
    }

    return BatchMapper.map(batchRow);
}