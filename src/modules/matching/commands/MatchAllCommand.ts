import * as BatchRepository from "../repositories/BatchRepository";

import * as MatchingService from "../services/Matching";

import * as BatchMapper from "../mappers/BatchMapper";
import * as EmployerMapper from "../mappers/EmployerMapper";
import * as CandidateEmailMapper from "../mappers/CandidateEmailMapper";

import Batch from "../entities/Batch";
import CandidateEmail from "../entities/CandidateEmail";

// Core Dependencies
import fs from "infa/FileSystemAdaptor";
import {EmailNotification} from "notify/EmailNotification";
import {Email} from "notify/messages/Email";



/**
 * Execute the matching algorithm in our application. Prepare the matches to later be sent out through a seperate algorithm
 */
export default async function exec()
{
    const batch = new Batch(BatchRepository.getId());
 
    const emailNotification: EmailNotification = new EmailNotification();

    // Loop through the employers from the mapper. Since we are looping through all we map one at a time with the read
    // bulk command.
    for await (const employer of EmployerMapper.readBulk()) {
        
        if( employer === undefined)
        {
            throw "Undefined Employer error!";
        }
        
        const batchMatch     = await MatchingService.match(employer, batch);     
        const candidateEmail = new CandidateEmail(batchMatch);

        // Render the email, and write the email to the cache.        
        const email: Email = await candidateEmail.render(emailNotification);
        const token: string = await fs.write(fs.CACHE, email);
        candidateEmail.setCacheIdentifier(token);

        await CandidateEmailMapper.create( candidateEmail );
    }

    await BatchMapper.create(batch);
}





