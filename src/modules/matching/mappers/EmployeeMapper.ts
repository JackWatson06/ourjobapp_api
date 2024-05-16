/**
 * This class will map the employee to our own internal memory represneation of an employee inside this entity framework.
 */

import { collections } from "db/MongoDb";
import { Schema } from "db/DatabaseSchema";

import { ObjectId } from "mongodb";

import * as LocationMapper from "./LocationMapper";

import Employee    from "../entities/Employee";
import Job         from "../entities/Job";
import CountryCode from "../entities/CountryCode";
import Location    from "../entities/Location";
import Industry    from "../entities/Industry";

/**
 * Map the jobs of the employee to what they are going to be used during the matching service.
 * @param db MongoDb
 * @param employeeMatchRow The matching employee row
 */
function mapJobs(employeeMatchRow: Schema.Employee): Array<Promise<Job>>
{
    return employeeMatchRow.job_id.map( async (jobId: ObjectId) => {
        const job: Schema.Job|null = await collections.jobs.find({ _id: jobId}).next()

        if( job != null && job._id != undefined)
        {
            return new Job( job._id.toString(), job.name, new Industry( job.job_group) );
        }

        return new Job("", "", new Industry(""));
    })
}


/**
 * Map the current country object to it's corresponding CountryCode value object.
 * @param db Database instance
 * @param countryObjectId ObjectIds that we need to encode to just regular country codes.
 */
function mapCountryCode(countryObjectId: Array<ObjectId>): Array<Promise<CountryCode>>
{
    return countryObjectId.map( async (countryId: ObjectId) => {
        const country: Schema.Country|null = await collections.countries.find({ _id: countryId}).next()

        if( country != null )
        {
            return new CountryCode( country.country_code );
        }

        return new CountryCode("");
    });
}

/**
 * Read in bulk from the mongodb. This will use a generator function in order to read in the data. 
 * @param filter Filter we are allowed to use for bulk read
 */
export async function *readBulk()
{    
    const employeeCursor = collections.employees.find({});

    while(await employeeCursor.hasNext()) {
        const employeeMatchRow: Schema.Employee|null = await employeeCursor.next();

        // Skip if we don't have the batch match.
        if(employeeMatchRow === null || employeeMatchRow._id === undefined)
        {
            yield undefined;
            continue;
        }

        // Map the authorized countries.
        const authorizedCodes: Array<CountryCode> = await Promise.all( mapCountryCode(employeeMatchRow.authorized) );
        const jobMap: Array<Job>                  = await Promise.all( mapJobs(employeeMatchRow) );
        let nationalCodes: Array<CountryCode>|undefined;
        let location: Location|undefined;

        if( employeeMatchRow.nations != undefined )
        {
            nationalCodes = await Promise.all( mapCountryCode(employeeMatchRow.nations) );
        }
        
        if( employeeMatchRow.place_id != undefined )
        {
            location = await LocationMapper.read(employeeMatchRow.place_id);
        }
        
        yield new Employee(
            employeeMatchRow._id.toString(),
            `${employeeMatchRow.fname} ${employeeMatchRow.lname}`,
            employeeMatchRow.phone,
            employeeMatchRow.email,
            employeeMatchRow.education,
            employeeMatchRow.experience,
            employeeMatchRow.hourly_rate,
            employeeMatchRow.where,
            employeeMatchRow.distance,
            jobMap,
            authorizedCodes,
            employeeMatchRow.information,
            nationalCodes,
            location
        )
    }
}
