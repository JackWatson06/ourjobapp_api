import * as MongoDb from "infa/MongoDb";
import * as Constants from "infa/Constants";
import * as Collections from "Collections";

import Location from "../entities/Location";
import Batch from "../entities/Batch";
import BatchMatch from "../entities/BatchMatch";

import * as EmployeeRepository from "../repositories/EmployeeRepository";

import { read as getLocation } from "../mappers/LocationMapper";

const mdb = MongoDb.db();

let jobs: Array<Collections.Job>;
let jobGroups: Array<Collections.JobGroup>;
let countries: Array<Collections.Country>;
let started: boolean = false;

/**
 * Start up the matching service by loading in the required collections.
 */
export async function startup() {
    jobs = await mdb.collection("jobs").find<Collections.Job>({}).toArray();
    jobGroups = await mdb.collection("jobs-groups").find<Collections.JobGroup>({}).toArray();
    countries = await mdb.collection("countries").find<Collections.Country>({}).toArray();
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

    console.log("Employer Location: ");
    var employer_location = await getLocation(employer.place_id);
    var employee_location;
    if (employee.place_id != undefined) {

        // var employee_place_id = employee.place_id;
        // employee_location = await getLocation(employee_place_id);
        // console.log(computeDistance(employer_location, employee_location));

    }


    // Calculate Distance.


    //Pull employee info and employer info:
    //COnvert from Longitude/Latitude

    // location_score = await locationScore(employer, employee);

    // auth_score = 1 + 2;

    // total_score = location_score + auth_score;

    // employer =
    // if (employer)


    return 1;

}


function computeDistance(cord1: Location, cord2: Location) {

    var lat2 = cord2.getLat();
    var lon2 = cord2.getLong();
    var lat1 = cord1.getLat();
    var lon1 = cord1.getLong();

    var R = 6371; // km 
    //has a problem with the .toRad() method below.
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

    // console.log(d);


}

// async function locationScore(employer, employee) {
//   // Get the GEOJSON form database, if it does not exist in databse then pull from google. thne cache in database.
//   // Only seelct candidates that are authorized
//   //   if(employer.authorized)
//   //   {
//   //       if()
//   //   }
// }
