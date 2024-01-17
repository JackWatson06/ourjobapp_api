import Industry from "./Industry";

export default class Job
{
    private id: string;
    private job: string;
    private industry: Industry;

    constructor(id: string, job: string, industry: Industry)
    {
        this.id       = id;
        this.job      = job;
        this.industry = industry;
    }

    public getId()
    {
        return this.id;
    }

    public getName()
    {
        return this.job;
    }

    public getIndustry()
    {
        return this.industry;
    }
}
