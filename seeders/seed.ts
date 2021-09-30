/**
 * Original Author: Jack Watosn
 * Create Date: 9/30/2021
 * Purpose: The purpose of this seed class is to call all of the other seeder scripts. We should only run this once when
 * we first create the system. This will start the initial seeding process. Can be extremely useful if we have distributed
 * systems, or even just getting setup on day one.
 * 
 * @TODO Add a check to make sure we only run this once, and warn the client if they have ran this more than once.
 * 
 */


import seedCareers from "./seed-careers";
import seedCharities from "./seed-charities";
import seedJobs from "./seed-jobs";


// We need to create an instance of mongoDB as well here.

seedCareers();
seedCharities();
seedJobs();


