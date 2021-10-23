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

// Just look at the coutnry data lol for some reason when we turn to JSON it is all Afghanistan.
type CountryRow = {
    Afghanistan: string;
};

// Where is the file that we are looking for located.
const INPUT  = __dirname + "/../raw-data/countries.xlsx";
const OUTPUT = __dirname + "/../raw-data/countries.json";

export default async function exec()
{
    // Read in the relevant page in the xlsx file.
    const workbook : XLSX.WorkBook = XLSX.readFile(INPUT);
    const page: XLSX.WorkSheet = workbook.Sheets[ workbook.SheetNames[0] ];
    
    // Excel worksheet
    const worksheetJSON: CountryRow[] = XLSX.utils.sheet_to_json(page);
    const extractedJSON: Collections.Country[] = [];
    
    // Loop through the different rows we have and store them in the database.
    for(const row of worksheetJSON)
    {
        const country: Collections.Country = {
            name: titleCase( row.Afghanistan.toLowerCase() ),
            created_at: MongoDb.now()
        }

        extractedJSON.push(country);
    }

    // Write the majors to a file.
    fs.writeFile(OUTPUT, JSON.stringify(extractedJSON), (error: NodeJS.ErrnoException) => {
        if(error)
        {
            console.log(error);
        }
    });
}
