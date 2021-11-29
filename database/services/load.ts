/**
 * Original Author: Jack Watson
 * Created Date: 10/3/2021
 * Purpose: The purpose of this class is to allow us to load in data from some generic raw json file into a collection
 * of our choosing. The raw file should already be formated to instantely be inserted into the database.
 * 
 */

import { collections } from "db/MongoDb";
import fs from "fs";

/**
 * Load data from a JSON file that is already formated to be inserted into the collection. This data will be gZipped so 
 * we will need to consider that fact.
 * @param rawData Name of the file in the raw-data directory
 * @param collection The collection we are loading the data into
 */
export default async function load(rawData: string, collection: string): Promise<void>
{
    const input: string   = `${__dirname}/../raw-data/${rawData}`;
    const data: Buffer    = fs.readFileSync(input);

    await collections[collection].insertMany( JSON.parse(data.toString()) ).catch((err: Error) => {
        console.error("ERROR");
        console.error(err);
    });
}
