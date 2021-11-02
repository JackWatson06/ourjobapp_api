import { Db, MongoClient, ObjectId } from "mongodb";

const uri: string = `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}`

const client: MongoClient = new MongoClient(uri);

export type MDb = Db;

export async function connect(): Promise<void>
{
    // Connect to the client
    await client.connect();
}

/**
 * Close the current client
 */
export async function close(): Promise<void>
{
    console.info(`Closed MongoDB Connection - URI: ${uri}`);
    await client.close();
}

/**
 * Get the instance of the mongodb client.
 */
export function db(): MDb
{   
    return client.db(process.env.MONGO_DB);
}


/**
 * Generate a new id that we can use in a domain object if we require reference to a identifier during some process.
 */
export function generate(): ObjectId
{
    return new ObjectId();
}

/**
 * Convert the string to the object id.
 * @param objectId Object Id as a string that we seek to convert.
 */
export function toObjectId(objectId: string): ObjectId
{
    return new ObjectId(objectId);
}

/**
 * Convert a list of object ids as stirngs to the objectId that MongoDb uses.
 * @param objectIds List of objects id strings that we are converting to the ObjectId type from MongoDb
 */
export function toObjectIds(objectIds: Array<string>): Array<ObjectId>
{
    return objectIds.map((toConvertId) => toObjectId(toConvertId));
}

//TED.com PERFECT EXAMPLE FOR THE EMAIL SIGN UP WITH GOOGLE, APPLAE, OR WHOMEVER

/**
 * Get the current time. We can use this method so we get a consistent time across the application.
 */
export function now(): number
{
    return Date.now();
}