/**
 * Original Author: Jack Watson
 * Created Date: 10/3/2021
 * Purpose: The purpose of this script is to turn the jobs xslx file that we have into a json file.
 */
import * as MongoDb from "../../src/core/infastructure/MongoDb";
import { titleCase } from "title-case";
import * as XLSX from "xlsx";
import fs from "fs";

// Define the charity type that is read in from the xcel sheet.
type JobsRow = {
    "Employee List": string;
    "Employer List": string;
};

// Where is the file that we are looking for located.
const INPUT            = __dirname + "/../raw-data/job-list.xlsx";
const OUTPUT_JOB       = __dirname + "/../raw-data/jobs.json";
const OUTPUT_JOB_GROUP = __dirname + "/../raw-data/job-groups.json";


export default async function exec()
{
    // Read in the relevant page in the xlsx file.
    const workbook : XLSX.WorkBook = XLSX.readFile(INPUT);
    const page: XLSX.WorkSheet = workbook.Sheets[ workbook.SheetNames[1] ];


    // Excel worksheet
    const worksheetJSON: JobsRow[] = XLSX.utils.sheet_to_json(page);

    // The database records to be stored
    const extractedJobsJSON: MongoDb.Job[]          = [];
    const extractedJobGroupJSON: MongoDb.JobGroup[] = [];

    for(const row of worksheetJSON)
    {
        const job: MongoDb.Job = {
            name: titleCase( row["Employee List"].toLowerCase() ),
            created_at: MongoDb.now()
        }

        const jobGroup: MongoDb.JobGroup = {
            name: titleCase( row["Employer List"].toLowerCase() ),
            created_at: MongoDb.now()
        }

        extractedJobsJSON.push(job);
        extractedJobGroupJSON.push(jobGroup);
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
