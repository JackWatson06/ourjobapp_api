// We use module aliasing so we will want to register any alias routes so that we don't need to use the annoying relative
// paths.
import 'module-alias/register';

// We will want to load in our enviornment variables for our current project into the node instance. This will always be included
// if we include this file.
import * as dotenv from "dotenv";
dotenv.config();

import { connect } from "../core/infa/MongoDb";

/**
 * Bootstrap MongoDB so we can use MongoDB in our application. This represents an infastructure dependency.
 */
async function mongoDb()
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
function payment()
{
    // TODO Implement Paypal API process
}



/**
 * Bootstrap the application
 */
export default async function bootstrap()
{   
    mongoDb();
    payment();
}