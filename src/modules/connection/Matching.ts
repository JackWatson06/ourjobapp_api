import * as MongoDb from "infa/MongoDb";
import * as Constants from "infa/Constants";
import * as Collections from "Collections";
import Location from "./entities/Location";

import { read as getLocation } from "./mappers/LocationMapper";

import {FindCursor} from "mongodb";

const mdb = MongoDb.db();
const MATCH_LIMIT = 100;

let jobs      : Array<Collections.Job>;
let jobGroups : Array<Collections.JobGroup>;
let countries : Array<Collections.Country>;

/**
 * 
 */
export async function matchAll() {
    await seedMemory();

    const employer: Collections.Employer|null = await mdb.collection("employers").findOne<Collections.Employer>({});

    if(employer != null)
    {
      await singleMatch(employer);
    }
}

/**
 * Matches against all employees based on: location, work auth, wage.
 */
async function singleMatch(employer: Collections.Employer): Promise<string> {

    // Dictionary that holds the top matches.
    let matchingEmployees = {}

    // Get every employee in the database.
    const employeeCursor: FindCursor<Collections.Employee> = await mdb.collection("employees").find<Collections.Employee>({});

    // Computer the score of the current employer against all the employees
    while(await employeeCursor.hasNext()) {
      const employee: Collections.Employee|null = await employeeCursor.next() ;

      if(employee === null)
      {
        continue;
      }

      console.log(employer);
      console.log(employee);

      await computeScore(employer, employee);
    }


    // Store the matching employee ids, and the employer.
    // const match = {
    //   employer_id: employer._id,
    //   employee_ids: Object.keys(matchingEmployees),
    //   created_at: MongoDb.now()
    // }

    // await mdb.collections("matches").insertOne(match);

    return "Hello";
}

/**
 * Seed the in memory collections of constants that won't change. Saves database hits.
 */
async function seedMemory() {
  jobs      = await mdb.collection("jobs").find<Collections.Job>({}).toArray();
  jobGroups = await mdb.collection("jobs-groups").find<Collections.JobGroup>({}).toArray();
  countries = await mdb.collection("countries").find<Collections.Country>({}).toArray();
}



// // Take in employee id & employer id:

async function computeScore(employer: Collections.Employer, employee: Collections.Employee) {
  
  console.log("Matching:");
  // console.log(employer);
  // console.log(employee);

  // console.log("Constants: ");
  // console.log(Constants.Distance.TEN_MILES);
  // console.log(Constants.Where.IN_PERSON);

  console.log("Employer Location: ");
  var employer_location = await getLocation(employer.place_id);
  var employee_location;
  if (employee.place_id != undefined){

    var employee_place_id = employee.place_id;
    employee_location = await getLocation(employee_place_id);
    console.log(computeDistance(employer_location, employee_location));

  }
  

  // Calculate Distance.


  //Pull employee info and employer info:
  //COnvert from Longitude/Latitude

  // location_score = await locationScore(employer, employee);

  // auth_score = 1 + 2;

  // total_score = location_score + auth_score;

  // employer =
  // if (employer)
}


function computeDistance(cord1: Location, cord2: Location) {

  var lat2 = cord2.getLat(); 
  var lon2 = cord2.getLong(); 
  var lat1 = cord1.getLat(); 
  var lon1 = cord1.getLong(); 

  var R = 6371; // km 
  //has a problem with the .toRad() method below.
  var x1 = lat2-lat1;
  var dLat = x1* Math.PI / 180;  
  var x2 = lon2-lon1;
  var dLon = x2* Math.PI / 180;  
  var a = Math.sin(dLat/2) * Math.sin(dLat/2) + 
                  Math.cos(lat1* Math.PI / 180) * Math.cos(lat2* Math.PI / 180) * 
                  Math.sin(dLon/2) * Math.sin(dLon/2);  
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c /1.60934 ; 
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
