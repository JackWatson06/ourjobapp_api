/**
 * Original Author: Jack Watson
 * Created Date: 10/3/2021
 * Purpose: The purpose of this script is to turn the jobs xslx file that we have into a json file.
 */
import { now } from "db/MongoDb";
import { Schema } from "db/DatabaseSchema";
import { titleCase } from "title-case";
import * as crypto from "crypto";
import * as XLSX from "xlsx";
import fs from "fs";

// Define the charity type that is read in from the xcel sheet.
type JobsRow = {
    "Employee List": string;
    "Employer List": string;
};

type TitleDictionary = {
    [name: string]: number;
}

// Where is the file that we are looking for located.
const INPUT            = __dirname + "/../raw-data/job-list.xlsx";
const OUTPUT_JOB       = __dirname + "/../raw-data/jobs.json";
const OUTPUT_JOB_GROUP = __dirname + "/../raw-data/job-groups.json";


export default async function exec()
{
    const jobDictionary: TitleDictionary = {};
    const jobGroupDictionary: TitleDictionary = {};

    // Read in the relevant page in the xlsx file.
    const workbook : XLSX.WorkBook = XLSX.readFile(INPUT);
    const page: XLSX.WorkSheet = workbook.Sheets[ workbook.SheetNames[1] ];

    // Excel worksheet
    const worksheetJSON: JobsRow[] = XLSX.utils.sheet_to_json(page);

    // The database records to be stored
    const extractedJobsJSON: Schema.Job[]          = [];
    const extractedJobGroupJSON: Schema.JobGroup[] = [];

    for(const row of worksheetJSON)
    {
        const jobString = titleCase( row["Employee List"].toLowerCase().trim() );
        const jobGroupString = titleCase( row["Employer List"].toLowerCase().trim() );

        const jobHash: string = crypto.createHash('md5').update(jobString).digest('hex');
        const jobGroupHash: string = crypto.createHash('md5').update(jobGroupString).digest('hex');

        // If the charity is already in the list then we just want to skip the charity.
        if( !jobDictionary.hasOwnProperty(jobHash) )
        {   
            const job: Schema.Job = {
                name: jobString,
                job_group: jobGroupString,
                created_at: now()
            }

            jobDictionary[jobHash] = 0;
            extractedJobsJSON.push(job);

        }

        // If the charity is already in the list then we just want to skip the charity.
        if( !jobGroupDictionary.hasOwnProperty(jobGroupHash) )
        {   
            const jobGroup: Schema.JobGroup = {
                name: jobGroupString,
                created_at: now()
            }

            jobGroupDictionary[jobGroupHash] = 0;
            extractedJobGroupJSON.push(jobGroup);
        }
    }

    const error = (error: NodeJS.ErrnoException) => {
        if(error)
        {
            console.log(error);
        }
    }

    // Write the majors to a file.
    fs.writeFile(OUTPUT_JOB, JSON.stringify(extractedJobsJSON), error);
    fs.writeFile(OUTPUT_JOB_GROUP, JSON.stringify(extractedJobGroupJSON), error);

}
