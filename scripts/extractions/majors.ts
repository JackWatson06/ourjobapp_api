/**
 * Original Author: Jack Watson
 * Created Date: 9/30/2021
 * Purpose: The purpose of this script is to turn the majors xcl file that we have into a json file.
 */
import * as MongoDb from "infa/MongoDb";
import * as Collections from "Collections";
import { titleCase } from "title-case";
import * as XLSX from "xlsx";
import fs from "fs";

// Define the charity type that is read in from the xcel sheet.
type MajorRow = {
    Column1: string;
};

// Where is the file that we are looking for located.
const INPUT  = __dirname + "/../raw-data/college-majors.xlsx";
const OUTPUT = __dirname + "/../raw-data/majors.json";

export default async function exec()
{
    // Read in the relevant page in the xlsx file.
    const workbook : XLSX.WorkBook = XLSX.readFile(INPUT);
    const page: XLSX.WorkSheet = workbook.Sheets[ workbook.SheetNames[1] ];

    // Excel worksheet
    const worksheetJSON: MajorRow[] = XLSX.utils.sheet_to_json(page);
    const extractedJSON: Collections.Charity[] = [];

    // Loop through the different rows we have and store them in the database.
    for(const row of worksheetJSON)
    {
        const major: Collections.Major = {
            name: titleCase( row.Column1.toLowerCase() ),
            created_at: MongoDb.now()
        }

        extractedJSON.push(major);
    }

    // Write the majors to a file.
    fs.writeFile(OUTPUT, JSON.stringify(extractedJSON), (error: NodeJS.ErrnoException) => {
        if(error)
        {
            console.log(error);
        }
    });
}
