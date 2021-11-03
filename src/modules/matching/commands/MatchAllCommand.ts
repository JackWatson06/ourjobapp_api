import * as BatchRepository from "../repositories/BatchRepository";

import * as MatchingService from "../services/Matching";

import * as BatchMapper from "../mappers/BatchMapper";
import * as EmployerMapper from "../mappers/EmployerMapper";
import * as EmailMapper from "../mappers/CachedEmailMapper";

import Batch from "../entities/Batch";
import CachedEmail from "../entities/CachedEmail";
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

        const batchMatch = await MatchingService.match(batch, employer);     
        const email = new CachedEmail(batchMatch);

        await email.generateEmail();

        await EmailMapper.create( email );
    }

    await BatchMapper.create(batch);
}





