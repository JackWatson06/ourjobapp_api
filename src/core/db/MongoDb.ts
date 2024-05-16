import { Db, MongoClient, ObjectId, Collection } from "mongodb";
import { Schema } from "./DatabaseSchema";

const uri: string = `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}`
const client: MongoClient = new MongoClient(uri, {
    ignoreUndefined: true
  });

// Map our collections to a typed named version of it. Also allow them to be read through regular array syntax.
type StringKeys = {
    [key: string]: any
}

interface CollectionMap extends StringKeys {
    majors        : Collection<Schema.Major>,
    countries     : Collection<Schema.Country>,
    jobs          : Collection<Schema.Job>,
    job_groups    : Collection<Schema.JobGroup>,
    charities     : Collection<Schema.Charity>,
    batches       : Collection<Schema.Batch>,
    batch_matches : Collection<Schema.BatchMatch>,
    matches       : Collection<Schema.Match>,
    emails        : Collection<Schema.Email>,
    locations     : Collection<Schema.Location>,
    payments      : Collection<Schema.Payment>,
    payouts       : Collection<Schema.Payout>,
    affiliates    : Collection<Schema.Affiliate>,
    employees     : Collection<Schema.Employee>,
    employers     : Collection<Schema.Employer>,
    documents     : Collection<Schema.Document>,
    signups       : Collection<Schema.Signup>,
    tokens        : Collection<Schema.Token>
}

export let collections: CollectionMap;

function initializeDatabase(): void
{
    const db: Db = client.db(process.env.MONGO_DB);

    collections = {
        majors        : db.collection("majors"),
        countries     : db.collection("countries"),
        jobs          : db.collection("jobs"),
        job_groups    : db.collection("jobGroups"),
        charities     : db.collection("charities"),
        batches       : db.collection("batches"),
        batch_matches : db.collection("batchMatches"),
        matches       : db.collection("matches"),
        emails        : db.collection("emails"),
        locations     : db.collection("location"),
        payments      : db.collection("payments"),
        payouts       : db.collection("payouts"),
        affiliates    : db.collection("affiliates"),
        employees     : db.collection("employees"),
        employers     : db.collection("employers"),
        documents     : db.collection("documents"),
        signups       : db.collection("signups"),
        tokens        : db.collection("tokens")
    }
}

/**
 * Connect to the mongoDb client. After we connect we will want to instantiate the database.
 */
export async function connect(): Promise<void>
{
    // Connect to the client
    await client.connect();

    initializeDatabase();

    console.info(`Open MongoDB Connection - URI: ${uri}`);
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
 * WARNING: Do NOT call this function unless you trully mean to. Obviously this function will drop the database completely.
 * Tred carefully.
 */
export async function dropDatabase()
{
    const db: Db = client.db(process.env.MONGO_DB);

    await db.dropDatabase();
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

/**
 * Get the current time. We can use this method so we get a consistent time across the application.
 */
export function now(): number
{
    return Date.now();
}

export { ObjectId };
