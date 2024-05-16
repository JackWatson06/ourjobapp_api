/**
 * The purpose of this script is to turn the majors xcl file that we have into a json file.
 */

import { now } from "db/MongoDb";
import { Schema } from "db/DatabaseSchema";
import { titleCase } from "title-case";
import * as XLSX from "xlsx";
import fs from "fs";
import {gzip} from "node-gzip";


// Just look at the coutnry data lol for some reason when we turn to JSON it is all Afghanistan.
type CountryRow = {
    Code: string;
    Country: string;
};

// Where is the file that we are looking for located.
const INPUT  = __dirname + "/source/countries.xlsx";
const OUTPUT = __dirname + "/../raw-data/countries.gz";

export default async function exec()
{
    // Read in the relevant page in the xlsx file.
    const workbook : XLSX.WorkBook = XLSX.readFile(INPUT);
    const page: XLSX.WorkSheet = workbook.Sheets[ workbook.SheetNames[0] ];
    
    // Excel worksheet
    const worksheetJSON: CountryRow[] = XLSX.utils.sheet_to_json(page);
    const extractedJSON: Schema.Country[] = [];
    
    // Loop through the different rows we have and store them in the database.
    for(const row of worksheetJSON)
    {
        const country: Schema.Country = {
            country_code : row.Code,
            name         : titleCase( row.Country.toLowerCase() ),
            created_at   : now()
        }

        extractedJSON.push(country);
    }

    // Write the majors to a file.
    fs.writeFile(OUTPUT, await gzip(JSON.stringify(extractedJSON)), (error: NodeJS.ErrnoException) => {
        if(error)
        {
            console.log(error);
        }
    });
}
