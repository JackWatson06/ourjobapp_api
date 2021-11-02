import { getDiffieHellman } from "crypto";
import * as MongoDb from "infa/MongoDb"

/**
 * Generate an id for a item in the batch collection.
 */
export function getId(): string
{
    return MongoDb.generate().toString();
}
