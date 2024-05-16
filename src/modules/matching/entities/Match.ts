/**
 * A match represents the connection between an employeeId and the corresponding employer. It is used by the pivot table
 * BatchMatch ... Batch => BatchMatch => Match
 */

import Employee from "./Employee";
import Job      from "./Job";

export default class Match
{
    // The employee identifier that this match had.
    private employee: Employee;

    // The job that this match is assoicated with.
    private job: Job;

    // The score that this match got.
    private score: number;

    constructor(employee: Employee, job: Job, score: number)
    {
        this.employee = employee;
        this.score    = score;
        this.job      = job;
    }

    public getJob(): Job
    {
        return this.job;
    }

    public getEmployee(): Employee
    {
        return this.employee;
    }

    public getScore(): number
    {
        return this.score;
    }


}

