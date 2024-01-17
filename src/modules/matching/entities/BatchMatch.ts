/**
 * Original Author: Jack Watson
 * Created Date: 11/2/2021
 * Purpose: This module deviates from the standard web application framework. Technically the Batch should be the aggregate
 * root, and a match should be under neath the batch if we are doing a batch map. But we can't afford to store ALL of the matches
 * under a batch since we do not know how many matches there will be. Maybe the batch class dependa on the repo of all the matches?
 * That may make sense. Even then though a repo should only have a single aggregate root that it maps to. This is fine the way it
 * is.
 */

import Match    from "./Match";
import Employer from "./Employer";

export default class BatchMatch
{
    private MATCH_LIMIT = 100;

    private batchId: string|undefined;
    private employer: Employer;

    // Get employee with the scores.
    private matches: Array<Match>;

    constructor(employer: Employer, batchId: string|undefined)
    {
        this.batchId    = batchId;
        this.employer   = employer;

        this.matches = [];
    }

    /**
     * Inser the employee id in correct spot. Record the scores that we have as well.
     * @param employeeId Employee we are trying to put in this match.
     * @param score The score that the employee got for the match with the current employer in this class
     */
    public integrateMatch(match: Match)
    {
        const originalLength = this.matches.length;
        // Try to insert into the current list if we have it.
        for(let i = 0; i < originalLength; i++)
        {
            if(this.matches[i].getScore() < match.getScore())
            {
                this.matches.splice(i, 0, match);
                break;
            }
        }

        // If the length of the array is zero
        if( originalLength === this.matches.length )
        {
            this.matches.push(match);
        }

        this.matches = this.matches.slice(0, this.MATCH_LIMIT);
    }

    // === GETTERS ===

    public getBatchId(): string|undefined
    {
        return this.batchId;
    }

    /**
     * Below should not return an error but rather return a result of if this method was successful or not.
     */
    public getEmployer(): Employer
    {
        return this.employer;
    }

    public getMatches(): Array<Match>
    {
        return this.matches;
    }
}
