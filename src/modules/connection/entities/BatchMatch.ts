/**
 * Original Author: Jack Watson
 * Created Date: 11/2/2021
 * Purpose: This module deviates from the standard web application framework. Technically the Batch should be the aggregate
 * root, and a match should be under neath the batch if we are doing a batch map. But we can't afford to store ALL of the matches
 * under a batch since we do not know how many matches there will be. Maybe the batch class dependa on the repo of all the matches?
 * That may make sense. Even then though a repo should only have a single aggregate root that it maps to. This is fine the way it
 * is.
 */

export default class BatchMatch
{
    private MATCH_LIMIT = 100;

    private batchId: string;
    private employerId: string;

    // Get employee with the scores.
    private employeeIds: Array<string>;
    private scores: Array<number>;

    constructor(batchId: string, employerId: string)
    {
        this.batchId    = batchId;
        this.employerId = employerId;

        this.employeeIds = [];
        this.scores      = [];
    }

    /**
     * Inser the employee id in correct spot. Record the scores that we have as well.
     * @param employeeId Employee we are trying to put in this match.
     * @param score The score that the employee got for the match with the current employer in this class
     */
    public integrateEmployeeId(employeeId: string, score: number)
    {
        const originalLength = this.employeeIds.length;
        // Try to insert into the current list if we have it.
        for(let i = 0; i < originalLength; i++)
        {
            if(this.scores[i] < score)
            {
                this.scores.splice(i, 0, score);
                this.employeeIds.splice(i, 0, employeeId);
                break;
            }
        }

        // If the length of the array is zero
        if( originalLength === this.employeeIds.length )
        {
            this.employeeIds.push(employeeId);
            this.scores.push(score);
        }

        this.scores      = this.scores.slice(0, this.MATCH_LIMIT);
        this.employeeIds = this.employeeIds.slice(0, this.MATCH_LIMIT);
    }

    // === GETTERS ===

    public getBatchId(): string
    {
        return this.batchId;
    }

    public getEmployerId(): string
    {
        return this.employerId;
    }


    public getEmployees(): Array<string>
    {
        return this.employeeIds;
    }

    public getScores(): Array<number>
    {
        return this.scores;
    }
}
