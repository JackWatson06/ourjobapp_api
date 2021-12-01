import { generate} from "db/MongoDb"

/**
 * Generate an id for a item in the batch collection.
 */
export function getId(): string
{
    return generate().toString();
}