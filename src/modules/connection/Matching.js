import { db, now, MDb } from "infa/MongoDb";
import * as Collections from "Collections";

const mdb = db();
const matchLimit = 100;

let jobs;
let jobGroups;
let countries;

function matchAll() {
  seedMemory();

  // Loop througfh all employers from database. Pull out one at time
  // Map of top employees

  // for(  )
  // Loop through all employees in database. Batch in groups of 1000

  // Run through scoring algo. Return map of 1000 employees and score.
  // Integrate 1000 employees into top employees for employer.

  // Done looping through all employees

  // Store the map inside the database... matches collection.
  // Send out email of matches.
}

/*
Matches against all employees based on: location, work auth, wage.
*/
export function singleMatch(employerId) {

    seedMemory();

    // Get employer info.
    const employer = await mdb.collection("employers").find({ _id: employerId });

    // Dictionary that holds the top matches.
    let matchingEmployees = {}

    // Get every employee in the database.
    mdb.collections("employee").find().forEach((employee) => {

      console.log(`Employer: ${JSON.stringify(employer)}`);
      console.log(`Employee: ${JSON.stringify(employee)}`);

      // Run through the scoring algo.

      const score = computesScore(employer, employee);
      matchingEmployees = integrate(matchingEmployees, score)
    });

    // Store the matching employee ids, and the employer.
    const match = {
      employer_id: employer._id,
      employee_ids: Object.key(matchingEmployees),
      created_at: now()
    }

    await mdb.collections("matches").insertOne(match);

    // Email out results.
}

/**
 * Seed the in memory collections of constants that won't change. Saves database hits.
 */
async function seedMemory() {
  jobs = await mdb.collection("jobs").find();
  jobGroups = await mdb.collections("job-groups").find();
  countries = await mdb.collections("countires").find();
}

// Take in employee id & employer id:

function computeScore(employee_id, employer_id) {
  //Pull employee info and employer info:
  //COnvert from Longitude/Latitude

  location_score = await locationScore(employer, employee);

  auth_score = 1 + 2;

  total_score = location_score + auth_score;

  // employer =
  // if (employer)
}

async function locationScore(employer, employee) {
  // Get the GEOJSON form database, if it does not exist in databse then pull from google. thne cache in database.
  // Only seelct candidates that are authorized
  //   if(employer.authorized)
  //   {
  //       if()
  //   }
}
