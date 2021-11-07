/**
 * Original Author: Jack Watson
 * Created Date: 11/3/2021
 * Purpose: This class takes a batch match and will return the view that we will show during the email.
 */

import BatchMatch from "../entities/BatchMatch"
import * as Constants from "infa/Constants";

type MatchView = {
    name        : string,
    job         : string,
    rate        : string,
    location    : string,
    education   : string,
    experience  : string,
    email       : string,
    phone       : string,
    where       : string,
    commitment  : string,
    resume      : string,
    paymentLink : string
}

export type BatchMatchView = {
    name: string,
    matches: Array<MatchView>
}


const distanceMapping = {
    [ Constants.Distance.WORLDWIDE ]               : "Worldwide",
    [ Constants.Distance.NATIONALLY ]              : "National",
    [ Constants.Distance.TEN_MILES ]               : "10 Miles",
    [ Constants.Distance.FIFTY_MILES ]             : "50 Miles",
    [ Constants.Distance.ONE_HUNDRED_MILES ]       : "100 Miles",
    [ Constants.Distance.TWO_HUNDRED_FIFTY_MILES ] : "250 Miles",
}

const commitmentMapping = {
    [ Constants.Commitment.FULL_TIME ] : "Full Time",
    [ Constants.Commitment.PART_TIME ] : "Part Time",
    [ Constants.Commitment.BOTH ]      : "Either"
}

const whereMapping = {
    [ Constants.Where.IN_PERSON ] : "In Person",
    [ Constants.Where.REMOTE ]    : "Remote",
    [ Constants.Where.BOTH ]      : "Either"
}

const educationMapping = {
    [ Constants.Education.BELOW_HIGHSCHOOL ]    : "No Highschool Diploma",
    [ Constants.Education.HIGHSCHOOL ]          : "Highschool Diploma",
    [ Constants.Education.ASSOCIATES ]          : "Associates Degree",
    [ Constants.Education.BACHELORS ]           : "Bachelors Degree",
    [ Constants.Education.MASTERS ]             : "Masters Degree",
    [ Constants.Education.DOCTORATE ]           : "Doctorate"
}

const experienceMapping = {
    [ Constants.Experience.ENTRY ]        : "Entry",
    [ Constants.Experience.INTERMEDIATE ] : "Intermediate",
    [ Constants.Experience.EXPERIENCED ]  : "Experienced",
    [ Constants.Experience.INTERN ]       : "Internship"
}

/**
 * Transform the affiliate into the something that the front-end will care about.
 * @param affiliate Affiliate we want to transform.
 */
export function transform(batchMatch: BatchMatch): BatchMatchView
{
    // console.log(batchMatch);
    
    return {
        
        name:    batchMatch.getEmployer().name,
        matches: batchMatch.getMatches().map( (match): MatchView => {
            return {
                name        : match.getEmployee().name,
                job         : match.getJob().getName(),
                rate        : `$${match.getEmployee().hourlyRate}/hr`,
                email       : match.getEmployee().email,
                phone       : match.getEmployee().phone,
                location    : distanceMapping[match.getEmployee().distance],
                education   : educationMapping[match.getEmployee().education],
                experience  : experienceMapping[match.getEmployee().experience],
                where       : whereMapping[match.getEmployee().experience],
                commitment  : commitmentMapping[match.getEmployee().experience],

                // Links also need the employees additional information
                resume      : "",
                paymentLink : `${process.env.DOMAIN}/api/v1/payment/start?epi=${batchMatch.getEmployer().id}&emi=${match.getEmployee().id}`
            }
        })
    }
}
