// We use module aliasing so we will want to register any alias routes so that we don't need to use the annoying relative
// paths.
import 'module-alias/register';

// We will want to load in our enviornment variables for our current project into the node instance.
import * as dotenv from "dotenv";
dotenv.config();

import { connect } from "../core/infa/MongoDb";

/**
 * Bootstrap the application
 */
export default async function bootstrap()
{   
    try
    {
        await connect()
    }
    catch(err: any)
    {
        err = err as Error;
        console.error(err.message);
    }
}