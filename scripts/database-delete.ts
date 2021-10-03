/**
 * Original Author: Jack Watson
 * Created Date: 10/3/2021
 * Purpose: The puropse of this file is to remove the database from the mongodb. This effectively deletes all the data
 * within the database. We will need to add a confirmation screen before this so we do not run this in production!
 * 
 * @TODO Add protection so that we don't aciddentaly run this on the production server and delete literally all of our data.
 */

import * as MongoDb from "../src/core/infastructure/MongoDb";

export default async function exec()
{
    const db: MongoDb.MDb = MongoDb.db();

    await db.dropDatabase();
}
