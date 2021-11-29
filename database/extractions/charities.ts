/**
 * Original Author: Jack Watson
 * Created Date: 9/30/2021
 * Purpose: The purpose of this script is to turn the charities xcl file that we have into a json file.
 */
import { now } from "db/MongoDb";
import { Schema } from "db/DatabaseSchema";
import { titleCase } from "title-case";
import * as crypto from "crypto";
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
    const extractedJSON: Schema.Charity[] = [];
    let initialCharityCount: number            = 0;
    let finalCharityCount: number              = 0;

    // Charity data is stored in multiple sheets.
    for(const sheetName in workbook.Sheets)
    {
        const page: XLSX.WorkSheet        = workbook.Sheets[ sheetName ];
        const worksheetJSON: CharityRow[] = XLSX.utils.sheet_to_json(page);

        // Get all the current charity data from the current row.
        for(const charityRow of worksheetJSON)
        {
            // Get all the details surronding this
            const charityName: string = charityRow[ Object.keys(charityRow)[0] ];
            initialCharityCount++;

            if(charityName != undefined && 
                charityName != null && 
                isNaN(+charityName))
            {
                const charityNameClean: string = charityName.toLowerCase().trim();
                const charityHash: string = crypto.createHash('md5').update(charityNameClean).digest('hex');

                // If the charity is already in the list then we just want to skip the charity.
                if( !charityDictionary.hasOwnProperty(charityHash) )
                {   
                    const charity: Schema.Charity    = {
                        name: titleCase( charityNameClean ),
                        hash: charityHash,
                        created_at: now()
                    };
    
                    finalCharityCount++;
    
                    charityDictionary[charityHash] = 0;
                    extractedJSON.push(charity);
                }
            }
        }
    }

    console.log("Total Charities Found in File: " + initialCharityCount);
    console.log("Final Charity Count: " + finalCharityCount);
    
    // Write the extracted charities to a file.
    fs.writeFile(OUTPUT, JSON.stringify(extractedJSON), (error) => {
        if (error) {
            console.error(error);
        }
    });
}