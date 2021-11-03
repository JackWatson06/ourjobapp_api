import * as BatchRepository from "../repositories/BatchRepository";
import * as EmployerRepository from "../repositories/EmployerRepository";

import * as MatchingService from "../services/Matching";

import * as MatchMapper from "../mappers/BatchMatchMapper";
import * as BatchMapper from "../mappers/BatchMapper";

import Batch from "../entities/Batch";

/**
 * Execute the matching algorithm in our application. Prepare the matches to later be sent out through a seperate algorithm
 */
export default async function exec()
{
    const batch = new Batch(BatchRepository.getId());
    
    await MatchingService.startup();
    await EmployerRepository.forEach(async (employer) => {
        const batchMatch = await MatchingService.match(batch, employer);        
        await MatchMapper.create( batchMatch );
    });

    await BatchMapper.create(batch);
}
