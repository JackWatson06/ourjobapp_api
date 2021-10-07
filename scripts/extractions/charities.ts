/**
 * Original Author: Jack Watson
 * Created Date: 9/30/2021
 * Purpose: The purpose of this script is to turn the charities xcl file that we have into a json file.
 */
import * as MongoDb from "infa/MongoDb";
import * as Collections from "Collections";
import { titleCase } from "title-case";
import * as XLSX from "xlsx";
import fs from "fs";

// Define the charity type that is read in from the xcel sheet.
type CharityRow = {
    [name: string]: string;
};

type CharityDictionary = {
    [name: string]: number;
}

// Where is the file that we are looking for located.
const INPUT  = __dirname + "/../raw-data/charities.xlsx";
const OUTPUT = __dirname + "/../raw-data/charities.json";

export default async function exec()
{
    const workbook : XLSX.WorkBook = XLSX.readFile(INPUT);

    const charityDictionary: CharityDictionary = {};
    const extractedJSON: Collections.Charity[]     = [];

    // let worksheetIndex = 0;
    // Charity data is stored in multiple sheets.
    for(const sheetName in workbook.Sheets)
    {
        // worksheetIndex++;

        const page: XLSX.WorkSheet        = workbook.Sheets[ sheetName ];
        const worksheetJSON: CharityRow[] = XLSX.utils.sheet_to_json(page);

        // const worksheetCount = worksheetJSON.length;
        // let charityIndex = 0;

        // Get all the current charity data from the current row.
        for(const charityRow of worksheetJSON)
        {
            // charityIndex++;
            // console.log(`Sheet ${worksheetIndex}: ${ charityIndex } Iteration / ${worksheetCount} Total`);

            // Get all the details surronding this
            const charityName: string = charityRow[ Object.keys(charityRow)[0] ];

            // If the charity is already in the list then we just want to skip the charity.
            if ( charityName != undefined && 
                 charityName != null && 
                 isNaN(+charityName) && 
                 charityDictionary[charityName] === undefined )
            {   
                const charity: Collections.Charity    = {
                    name: titleCase( charityName.toLowerCase() ),
                    created_at: MongoDb.now()
                };

                charityDictionary[charityName] = 0;
                extractedJSON.push(charity);
            }
        }
    }


    // Write the extracted charities to a file.
    fs.writeFile(OUTPUT, JSON.stringify(extractedJSON), (error) => {
        if (error) {
            console.error(error);
        }
    });
}