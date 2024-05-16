/**
 * The puropse of this file is to remove the database from the mongodb. This effectively deletes all the data
 * within the database. We will need to add a confirmation screen before this so we do not run this in production!
 */

import { dropDatabase } from "db/MongoDb";

export default async function exec()
{
    try
    {
        await dropDatabase();
    }
    catch(error)
    {
        console.error("Critical failure during drop database attempt.");
        console.error(error);
    }
}
