/**
 * Original Author: Jack Watson
 * Created Date: 11/2/2021
 * Purpose: A match represents the connection between an employeeId and the corresponding employer. It is used by the pivot table
 * BatchMatch ... Batch => BatchMatch => Match
 */

export default class Match
{
    // The employee identifier that this match had.
    private employeeId: string;

    // The score that this match got.
    private score: number;

    // The job name that we matched on. Pulled from the jobs database.
    private jobId: string;

    constructor(employeeId: string, score: number, jobId: string)
    {
        this.employeeId = employeeId;
        this.score      = score;
        this.jobId      = jobId;
    }

    // === GETTERS ====
    public getJob(): string
    {
        return this.jobId;
    }

    public getEmployee(): string
    {
        return this.employeeId;
    }

    public getScore(): number
    {
        return this.score;
    }


}

