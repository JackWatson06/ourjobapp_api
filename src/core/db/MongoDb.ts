import { Db, MongoClient, ObjectId, Collection } from "mongodb";
import { Schema } from "./DatabaseSchema";

const uri: string = `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}`
const client: MongoClient = new MongoClient(uri);

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
    location      : Collection<Schema.Location>,
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

// This export allows us to access collections without spelling the damn string!

function initializeDatabase(): void
{
    const db: Db = client.db(process.env.MONGO_DB);

    collections.tokens        = db.collection("tokens");
    collections.countries     = db.collection("countries");
    collections.jobs          = db.collection("jobs");
    collections.job_groups    = db.collection("jobGroups");
    collections.charities     = db.collection("charities");
    collections.batches       = db.collection("batches");
    collections.batch_matches = db.collection("batchMatches");
    collections.matches       = db.collection("matches");
    collections.emails        = db.collection("emails");
    collections.location      = db.collection("location");
    collections.payments      = db.collection("payments");
    collections.payouts       = db.collection("payouts");
    collections.affiliates    = db.collection("affiliates");
    collections.employees     = db.collection("employees");
    collections.employers     = db.collection("employers");
    collections.documents     = db.collection("documents");
    collections.signups       = db.collection("signups");
    collections.tokens        = db.collection("tokens");
}

/**
 * Connect to the mongoDb client. After we connect we will want to instantiate the database.
 */
export async function connect(): Promise<void>
{
    // Connect to the client
    await client.connect();

    initializeDatabase();
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
