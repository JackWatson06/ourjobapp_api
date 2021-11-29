// We use module aliasing so we will want to register any alias routes so that we don't need to use the annoying relative
// paths.
import 'module-alias/register';

// We will want to load in our enviornment variables for our current project into the node instance. This will always be included
// if we include this file.
import * as dotenv from "dotenv";
dotenv.config();

import { connect } from "../core/db/MongoDb";
import paypal from "paypal-rest-sdk";

import * as env from "environment"; // This just sets the types for the environment variables

/**
 * Bootstrap MongoDB so we can use MongoDB in our application. This represents an infastructure dependency.
 */
async function mongoDb(): Promise<void>
{
    try
    {
        await connect();
        
    }
    catch(err: any)
    {
        err = err as Error;
        console.error(err.message);
    }
}

/**
 * Bootstrap the paypal API so we can use it in our application.
 */
function payment(): void
{
    paypal.configure({
        'mode'          : process.env.PAYPAL_MODE,
        'client_id'     : process.env.PAYPAL_CLIENT_ID,
        'client_secret' : process.env.PAYPAL_SECRET
    });
}

/**
 * Bootstrap the application
 */
export default async function bootstrap()
{   
    mongoDb();
    payment();
}