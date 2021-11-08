import * as MongoDb from "infa/MongoDb";
import * as Collections from "Collections";

import { ObjectId } from "mongodb";

import * as LocationMapper from "./LocationMapper";

import Employer    from "../entities/Employer";
import Location    from "../entities/Location";
import Industry from "../entities/Industry";

/**
 * Map the industry of an employer.
 * @param db Instance of db
 * @param employerMatchRow The matching employer row that we are currently mapping
 */
function mapIndustry(db: MongoDb.MDb, employerMatchRow: Collections.Employer): Array<Promise<Industry>>
{
    return employerMatchRow.industry.map( async (industryId: ObjectId) => {
        const industry: Collections.JobGroup|null = await db.collection("jobGroups").find<Collections.JobGroup>({ _id: industryId}).next()

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
    const db: MongoDb.MDb  = MongoDb.db();
    const employerMatchRow: Collections.Employer|null = await db.collection("employers").findOne<Collections.Employer>({
        _id: MongoDb.toObjectId(employerId),
        verified: true
    });

    // Skip if we don't have the batch match.
    if(employerMatchRow === null || employerMatchRow._id === undefined)
    {
        return null;
    }

    // Map the authorized countries.
    const industryMap: Array<Industry> = await Promise.all( mapIndustry(db, employerMatchRow) );
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
    const db: MongoDb.MDb  = MongoDb.db();
    const employerCursor = db.collection("employers").find<Collections.Employer>({
        verified: true
    });

    while(await employerCursor.hasNext()) {
        const employerMatchRow: Collections.Employer|null = await employerCursor.next();

        // Skip if we don't have the batch match.
        if(employerMatchRow === null || employerMatchRow._id === undefined)
        {
            yield undefined;
            continue;
        }

        // Map the authorized countries.
        const industryMap: Array<Industry> = await Promise.all( mapIndustry(db, employerMatchRow) );
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
