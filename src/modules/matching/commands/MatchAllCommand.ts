import * as BatchRepository from "../repositories/BatchRepository";
import * as MatchingService from "../services/Matching";
import * as BatchMapper from "../mappers/BatchMapper";
import * as EmployerMapper from "../mappers/EmployerMapper";
import * as CandidateEmailMapper from "../mappers/CandidateEmailMapper";

import Batch from "../entities/Batch";
import CandidateEmail from "../entities/CandidateEmail";

import fs from "infra/FileSystemAdaptor";
import {Notification} from "notify/Notification";
import {Email} from "notify/messages/Email";
import { HandlebarsAdaptor } from "template/HandlebarsAdaptor";

/**
 * Execute the matching algorithm in our application. Prepare the matches to later be sent out through a seperate algorithm
 */
export default async function exec()
{
    const batch = new Batch(BatchRepository.getId());
 
    const emailNotification: Notification = new Notification();
    const templateEngine = new HandlebarsAdaptor();


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
        const email: Email = await candidateEmail.render(templateEngine);
        const token: string = await fs.write(fs.CACHE, JSON.stringify(email));
        candidateEmail.setCacheIdentifier(token);

        await CandidateEmailMapper.create( candidateEmail );
    }

    await BatchMapper.create(batch);
}





