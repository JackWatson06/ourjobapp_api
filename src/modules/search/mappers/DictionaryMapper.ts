/**
 * Original Author: Jack Watson
 * Created Date: 10/7/2021
 * Purpose: The purpose of this mapper is to map a generic dictionary collection to a list of return values... I was hesitant
 * about making this generic to handle any collection which has a name. But I figured it would save alot of code typing
 * initially so I decided to go with it. We will see how it turns out. Chances are I will move alot of this elsewhere in the
 * project once I have more defined boudned contexts.
 */

import * as MongoDb from "infa/MongoDb";
import DictionaryResult from "../entities/DictionaryResult";

type DictionaryQuery = { 
    name: string;
};

// This is a pseudo type which allows us to represent any collection as a dictionary row. We may want to look in the future
// at making a this type it to the actually collection that gets returned. We may also want to turn mongoDb into using
// types on the actual collection using dot notation ... etc. db.jobs.findOne();
type DictionaryRow = {
    _id: string,
    name: string
}

export async function read(search: string, source: string): Promise<Array<DictionaryResult>>
{
    const db: MongoDb.MDb = MongoDb.db();
    const query: DictionaryQuery = {
        "name": search
    };

    return db.collection(source).find<DictionaryRow>(query).map(( result ) => {
        return new DictionaryResult( result._id, result.name );
    }).toArray();
}


