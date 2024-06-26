/**
 * The purpose of this script is to turn the majors xcl file that we have into a json file.
 */

import { now } from "db/MongoDb";
import { Schema } from "db/DatabaseSchema";
import { titleCase } from "title-case";
import * as XLSX from "xlsx";
import fs from "fs";
import {gzip} from "node-gzip";

// Define the charity type that is read in from the xcel sheet.
type MajorRow = {
    Column1: string;
};

// Where is the file that we are looking for located.
const INPUT  = __dirname + "/source/college-majors.xlsx";
const OUTPUT = __dirname + "/../raw-data/majors.gz";

export default async function exec()
{
    // Read in the relevant page in the xlsx file.
    const workbook : XLSX.WorkBook = XLSX.readFile(INPUT);
    const page: XLSX.WorkSheet = workbook.Sheets[ workbook.SheetNames[1] ];

    // Excel worksheet
    const worksheetJSON: MajorRow[] = XLSX.utils.sheet_to_json(page);
    const extractedJSON: Schema.Major[] = [];

    // Loop through the different rows we have and store them in the database.
    for(const row of worksheetJSON)
    {
        const major: Schema.Major = {
            name: titleCase( row.Column1.toLowerCase() ),
            created_at: now()
        }

        extractedJSON.push(major);
    }

    // Write the majors to a file.
    fs.writeFile(OUTPUT, await gzip(JSON.stringify(extractedJSON)), (error: NodeJS.ErrnoException) => {
        if(error)
        {
            console.log(error);
        }
    });
}
