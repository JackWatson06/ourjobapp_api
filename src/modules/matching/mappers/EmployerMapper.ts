import { collections, toObjectId, ObjectId } from "db/MongoDb";
import { Schema } from "db/DatabaseSchema";

import * as LocationMapper from "./LocationMapper";

import Employer    from "../entities/Employer";
import Industry from "../entities/Industry";

/**
 * Map the industry of an employer.
 * @param db Instance of db
 * @param employerMatchRow The matching employer row that we are currently mapping
 */
function mapIndustry(employerMatchRow: Schema.Employer): Array<Promise<Industry>>
{
    return employerMatchRow.industry.map( async (industryId: ObjectId) => {
        const industry: Schema.JobGroup|null = await collections.job_groups.find({ _id: industryId}).next()

        if( industry != null && industry._id != undefined)
        {
            return new Industry( industry.name );
        }

        return new Industry("");
    })
}

/**
 * REad a single employer from the database.
 * @param employerId Employer identifier
 */
export async function read(employerId: string): Promise<Employer|null>
{    
    const employerMatchRow: Schema.Employer|null = await collections.employers.findOne({
        _id: toObjectId(employerId)
    });

    // Skip if we don't have the batch match.
    if(employerMatchRow === null || employerMatchRow._id === undefined)
    {
        return null;
    }

    // Map the authorized countries.
    const industryMap: Array<Industry> = await Promise.all( mapIndustry(employerMatchRow) );
    const location = await LocationMapper.read(employerMatchRow.place_id);
    
    return new Employer(
        employerMatchRow._id.toString(),
        `${employerMatchRow.fname} ${employerMatchRow.lname}`,
        employerMatchRow.email,
        employerMatchRow.salary,
        employerMatchRow.where,
        employerMatchRow.authorized,
        location,
        employerMatchRow.experience,
        industryMap
    )
}

/**
 * Read a bunch of employers from the database.
 */
export async function *readBulk()
{    
    const employerCursor = collections.employers.find({});

    while(await employerCursor.hasNext()) {
        const employerMatchRow: Schema.Employer|null = await employerCursor.next();

        // Skip if we don't have the batch match.
        if(employerMatchRow === null || employerMatchRow._id === undefined)
        {
            yield undefined;
            continue;
        }

        // Map the authorized countries.
        const industryMap: Array<Industry> = await Promise.all( mapIndustry(employerMatchRow) );
        const location = await LocationMapper.read(employerMatchRow.place_id);
        
        yield new Employer(
            employerMatchRow._id.toString(),
            `${employerMatchRow.fname} ${employerMatchRow.lname}`,
            employerMatchRow.email,
            employerMatchRow.salary,
            employerMatchRow.where,
            employerMatchRow.authorized,
            location,
            employerMatchRow.experience,
            industryMap
        )
    }
}
