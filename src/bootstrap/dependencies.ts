// We will want to load in our enviornment variables for our current project into the node instance.
import * as dotenv from "dotenv";
dotenv.config();

import { connect } from "../core/infastructure/MongoDb";

/**
 * Bootstrap the application
 */
export default async function bootstrap()
{
    await connect().catch((err: Error) => {
        console.error("Could not connect to the MongoDB Database!");
        console.error(err);
    });
}