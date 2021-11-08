import * as BatchRepository from "../repositories/BatchRepository";

import * as MatchingService from "../services/Matching";

import * as BatchMapper from "../mappers/BatchMapper";
import * as EmployerMapper from "../mappers/EmployerMapper";
import * as CandidateEmailMapper from "../mappers/CandidateEmailMapper";

import Batch from "../entities/Batch";
import CandidateEmail from "../entities/CandidateEmail";
/**
 * Execute the matching algorithm in our application. Prepare the matches to later be sent out through a seperate algorithm
 */
export default async function exec()
{
    const batch = new Batch(BatchRepository.getId());
    
    // Loop through the employers from the mapper. Since we are looping through all we map one at a time with the read
    // bulk command.
    for await (const employer of EmployerMapper.readBulk()) {
        
        if( employer === undefined)
        {
            throw "Undefined Employer error!";
        }
        
        const batchMatch = await MatchingService.match(employer, batch);     
        const email      = new CandidateEmail(batchMatch);

        
        await email.cache();
        await CandidateEmailMapper.create( email );
    }

    await BatchMapper.create(batch);
}





