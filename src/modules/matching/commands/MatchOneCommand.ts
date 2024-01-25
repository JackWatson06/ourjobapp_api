/**
 * Original Author: Jack Watson
 * Created Date: 11/7/2021
 * Purpose: This file will notify a single employer of any matches that they got on signup. We will only be calling this class
 * once during the signup process because we run matching on employer signup.
 */

import * as MatchingService from "../services/Matching";

import * as EmployerMapper from "../mappers/EmployerMapper";
import * as CandidateEmailMapper from "../mappers/CandidateEmailMapper";

import CandidateEmail from "../entities/CandidateEmail";
import Employer from "../entities/Employer";

import { Notification } from "notify/Notification";
import { HandlebarsAdaptor } from "template/HandlebarsAdaptor";

/**
 * I need to get the employer id in here.
 */
export default async function exec(employerId: string)
{   
    // Loop through the employers from the mapper. Since we are looping through all we map one at a time with the read
    // bulk command.
    const employer: Employer|null = await EmployerMapper.read(employerId);

    const notification = new Notification();
    const templateEngine = new HandlebarsAdaptor();

    if(employer != null)
    {
        const batchMatch = await MatchingService.match(employer);     

        const email = new CandidateEmail(batchMatch);
    
        await email.send(notification, templateEngine);
        await CandidateEmailMapper.create( email ); 
    }
}
