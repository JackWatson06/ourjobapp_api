import * as BatchRepository from "../repositories/BatchRepository";

import * as BatchMatchView from "../views/BatchMatchView";

import * as MatchingService from "../services/Matching";

import * as MatchMapper from "../mappers/BatchMatchMapper";
import * as BatchMapper from "../mappers/BatchMapper";
import * as EmployerMapper from "../mappers/EmployerMapper";

import Batch from "../entities/Batch";
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
        const batchView  = BatchMatchView.transform(batchMatch);
        
        console.log(batchView);
    
        // await MatchMapper.create( batchMatch );
    }

    // await BatchMapper.create(batch);
}





