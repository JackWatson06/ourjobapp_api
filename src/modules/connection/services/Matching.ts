import * as MongoDb from "infa/MongoDb";
import * as Constants from "infa/Constants";
import * as Collections from "Collections";

import Location from "../entities/Location";
import Batch from "../entities/Batch";
import BatchMatch from "../entities/BatchMatch";

import * as EmployeeRepository from "../repositories/EmployeeRepository";

import { read as getLocation } from "../mappers/LocationMapper";

import { ObjectId } from "mongodb";

const mdb = MongoDb.db();


type CountriesMap = {
    [ key: string ]: string
}

type JobMap = {
    [ key: string ]: string
}

const jobs: JobMap = {};
const countries: CountriesMap = {};
let started: boolean = false;

/**
 * Start up the matching service by loading in the required collections.
 */
export async function startup() {

    // await mdb.collection("jobs").find<Collections.Job>({}).forEach(async (job) => {

    //     jobs[job._id?.toString() ?? ""] = ( await mdb.collection("jobs-groups").findOne<Collections.JobGroup>({
    //         name: job.job_group
    //     }) )

    // });
        
    await mdb.collection("countries").find<Collections.Country>({}).forEach((country) => {
        countries[country._id?.toString() ?? ""] = country.country_code;
    });
    started = true;
}

/**
 * Return a batch match which will list all of the employees which match that employer on the given batch.
 * @param batch The batch that we are using to match the employer.
 * @param employer The employer that we are currently matching
 */
export async function match(batch: Batch, employer: Collections.Employer): Promise<BatchMatch> {

    if (!started)
    {
        throw "Matching Service not seeded yet!";
    }

    if(employer._id === undefined)
    {
        throw "Employer does not have a id";
    }


    const newMatch: BatchMatch = new BatchMatch(batch.getId(), employer._id.toString());

    // Loop through all of the employees using the employee repository. This will handle looping thorugh the collection.
    await EmployeeRepository.forEach(async (employee: Collections.Employee) => {
        const score: number = await computeScore(employer, employee);

        // Zero is a no-no we do not want to match the employer with the employee with a zero... most matches will have a zero.
        if( employee._id != undefined)
        {   
            newMatch.integrateEmployeeId(employee._id.toString(), score);
        }
    });
    
    return newMatch;
}

// // Take in employee id & employer id:

async function computeScore(employer: Collections.Employer, employee: Collections.Employee): Promise<number> {

    console.log("Matching:");
    console.log(employer);
    console.log(employee);

    // console.log("Constants: ");
    // console.log(Constants.Distance.TEN_MILES);
    // console.log(Constants.Where.IN_PERSON);

    locationScore(employee, employer);

    // Calculate Distance.
    if (!(employer.experience.includes( employee.experience))){
        
        return 0;

    } else if (! ( employee.hourly_rate >= employer.salary)){

        return 0;
        
    }

    // Each job matches to 1 job group.

    //Pull employee info and employer info:
    //COnvert from Longitude/Latitude

    // location_score = await locationScore(employer, employee);

    // auth_score = 1 + 2;

    // total_score = location_score + auth_score;

    // employer =
    // if (employer)


    return 1;

}

/**
 * Generate a location score for the employee and the employer.
 */
async function locationScore(employee: Collections.Employee, employer: Collections.Employer)
{
    const employerLocation: Location = await getLocation(employer.place_id);
    const employeeLocation: Location|undefined = employee.place_id != undefined ? await getLocation(employee.place_id) : undefined; 

    let employeeAuthorized = employee.authorized.map( (countryID: ObjectId) => countries[countryID.toString()] );
    let employeeNations    = employee.nations?.map(   (countryID: ObjectId) => countries[countryID.toString()] );

    // Authorized
    if( !(employerLocation.getCountry() in employee.authorized) ){
        return 0;
    }

    // If both party are looking for remote, return score of 1.
    if ( ! (employer.where === Constants.Where.REMOTE && employee.where === Constants.Where.IN_PERSON) )
    {
        return checkDistance(employee, employerLocation, employeeLocation);
    }

    return 0;
}

/**
 * Check if the employee wants to work with the employer based on the distance that the EMPLOYEE has set.
 */
function checkDistance(employee: Collections.Employee, employerLocation: Location, employeeLocation: Location|undefined )
{
    const employeeNations = employee.nations?.map( (countryID: ObjectId) => countries[countryID.toString()] );

    if(employee.distance === Constants.Where.NATIONALLY 
        && employeeNations != undefined
        && employeeNations.includes( employerLocation.getCountry()) )
    {
        return 1;
    }
    else if(employeeLocation != undefined)
    {
        const distance: number = computeDistance(employerLocation, employeeLocation);

        if( distance < employee.distance)
        {
            return 1 + ( 1 / distance);
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