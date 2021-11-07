/**
 * Original Author: Jack Watson + Mark Chang (thx!)
 * Created Date: 11/3/2021
 * Purpose: This matching class holds the algorithm behind how we match the employer with the employee. We seek to improve this
 * in the further seeing as it is quite archaic in it's current implementation. 
 */

// Entities (Damn there a lot of entities. I guess this is quite the operation here.)
import Location from "../entities/Location";
import Batch from "../entities/Batch";
import BatchMatch from "../entities/BatchMatch";
import Match from "../entities/Match";
import Employee from "../entities/Employee";
import Employer from "../entities/Employer";
import Industry from "../entities/Industry";
import CountryCode from "../entities/CountryCode";

// Persistance Layer items
import * as EmployeeMapper from "../mappers/EmployeeMapper";

// Constants imports
import * as Constants from "infa/Constants";


/**
 * Return a batch match which will list all of the employees which match that employer on the given batch.
 * @param batch The batch that we are using to match the employer.
 * @param employer The employer that we are currently matching
 */
export async function match(batch: Batch, employer: Employer): Promise<BatchMatch> {
    
    const newMatch: BatchMatch = new BatchMatch(batch.getId(), employer);

    for await (const employee of EmployeeMapper.readBulk()) {

        if( employee === undefined )
        {
            break;
        }
        
        const match: Match|undefined = await createMatchIfExists(employer, employee);

        // Zero is a no-no we do not want to match the employer with the employee with a zero... most matches will have a zero.
        if( match != undefined )
        {   
            newMatch.integrateMatch(match);
        }
    }
    
    return newMatch;
}


// Take in employee id & employer id:
async function createMatchIfExists(employer: Employer, employee: Employee): Promise<Match|undefined> {

    // return new Match(employee, new Job("507f1f77bcf86cd799439011", "TEsting", new Industry("Fatty")), 30);

    // ==== Match the experience ====
    if (!(employer.experience.includes( employee.experience)))
    {
        console.log("Failed on Experience!");
        return undefined;
    } 
    
    // ==== Match the hourly rate ====
    if (!( employee.hourlyRate <= employer.salary)) // If they are further under maybe we give a higher score? 
    {
        console.log("Failed on Rate! Employee rate is: " + employee.hourlyRate + " Employer rate is: " + employer.salary);
        return undefined;    
    }


    // ==== Match the commitment ====
    // Make sure that the employer, and the employee don't want different things.
    if( employer.where === Constants.Commitment.PART_TIME && employee.where === Constants.Commitment.FULL_TIME )
    {
        console.log("Failed on Commitment!");
        return undefined;
    } 


    // ==== Match the jobs ====
    
    // Determine if the job type matches that of the employers group.
    for(const desiredJob of employee.jobs)
    {
        const industry: Industry = desiredJob.getIndustry();

        if( employer.industry.some(industry => industry.getName() === industry.getName() ))
        {
            
            const score: number = await locationScore(employee, employer);

            if( score != 0 )
            {   
                return new Match(employee, desiredJob, score);
            }
            else
            {
                return undefined;
            }
        }
    }
    // Get the socre based on the location of the employee relative to the employer.
    return undefined;
}

/**
 * Generate a location score for the employee and the employer.
 */
async function locationScore(employee: Employee, employer: Employer): Promise<number>
{
    const employerLocation: Location             = employer.location;
    const employeeLocation: Location|undefined   = employee.location; 
    const employeeAuthorized: Array<CountryCode> = employee.authorized;

    // Authorized
    // if( (employer.authorized) && !(employeeAuthorized.includes( employerLocation.getCountry() ) ) )
    if( (employer.authorized) && !(employeeAuthorized.some(i => i.getCountryCode() === employerLocation.getCountry().getCountryCode())) )
    {
        console.log("Failed on Authorized! Employer authorization is : " + employer.authorized + " Employee authorization is : " + employeeAuthorized + "\n");
        return 0;
    }

    // If both party are looking for remote, return score of 1.
    if ( ! (employer.where === Constants.Where.REMOTE && employee.where === Constants.Where.IN_PERSON) )
    {
        return checkDistance(employee, employerLocation, employeeLocation);
    }

    console.log("Failed on no location!");
    return 0;
}

/**
 * Check if the employee wants to work with the employer based on the distance that the EMPLOYEE has set.
 */
function checkDistance(employee: Employee, employerLocation: Location, employeeLocation: Location|undefined ): number
{
    const employeeNations: Array<CountryCode>|undefined = employee.national;

    // If the employee is set to worldwide then match with a one.
    if(employee.distance === Constants.Distance.WORLDWIDE)
    {
        return 1;
    }

    // Check the employees counties is in the employers location.
    if(employee.distance === Constants.Distance.NATIONALLY 
        && employeeNations != undefined
        && employeeNations.some(i => i.getCountryCode() === employerLocation.getCountry().getCountryCode()))
    {
        return 2;
    }
    
    // If the employee has a location.
    if(employeeLocation != undefined)
    {
        const distance: number = computeDistance(employerLocation, employeeLocation);

        if( distance < employee.distance)
        {
            return 2 + ( 1 / distance);
        }
    }

    return 0;
}

/**
 * Compute distance between the location that we pass in with the 
 */
function computeDistance(cord1: Location, cord2: Location) 
{
    var lat2 = cord2.getLat();
    var lon2 = cord2.getLong();
    var lat1 = cord1.getLat();
    var lon1 = cord1.getLong();

    var R = 6371; // km 
    var x1 = lat2 - lat1;
    var dLat = x1 * Math.PI / 180;
    var x2 = lon2 - lon1;
    var dLon = x2 * Math.PI / 180;
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c / 1.60934;

    return d;
}