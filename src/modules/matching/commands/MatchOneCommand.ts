
import * as MatchingService from "../services/Matching";

import * as EmployerMapper from "../mappers/EmployerMapper";
import * as CandidateEmailMapper from "../mappers/CandidateEmailMapper";

import CandidateEmail from "../entities/CandidateEmail";
import Employer from "../entities/Employer";

/**
 * I need to get the employer id in here.
 */
export default async function exec(employerId: string)
{   
    // Loop through the employers from the mapper. Since we are looping through all we map one at a time with the read
    // bulk command.
    const employer: Employer|null = await EmployerMapper.read(employerId);

    if(employer != null)
    {
        const batchMatch = await MatchingService.match(employer);     

        const email = new CandidateEmail(batchMatch);
    
        await email.sendEmail();
    
        await CandidateEmailMapper.create( email ); 
    }
}
