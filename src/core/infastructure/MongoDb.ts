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

//TED.com PERFECT EXAMPLE FOR THE EMAIL SIGN UP WITH GOOGLE, APPLAE, OR WHOMEVER

/**
 * Get the current time. We can use this method so we get a consistent time across the application.
 */
export function now(): number
{
    return Date.now();
}

// ===============
// |   Models    |
// ===============

// Major Model
export type Major = {
    _id?: ObjectId,
    name: string,
    created_at: number
}

// Job Model
export type Job = {
    _id?: ObjectId,
    name: string,
    created_at: number
}

// Job Group Model
export type JobGroup = {
    _id?: ObjectId,
    name: string,
    created_at: number
}

// Charity Model
export type Charity = {
    _id?: ObjectId,
    name: string,
    created_at: number
}

// Affiliate Model
export type Affiliate = {
    _id?: ObjectId,
    affiliate_id?: ObjectId,
    updated_at?: string,

    name: string,
    charity: string,
    email: string,
    verified: boolean
    created_at: number
}