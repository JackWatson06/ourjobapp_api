import { collections } from "db/MongoDb";
import load from "./services/load";

export default async function exec()
{
    await load("charities.json",  "charities");
    await load("countries.json",  "countries");
    await load("job-groups.json", "jobGroups");
    await load("jobs.json",       "jobs");
    await load("majors.json",     "majors");

    await collections.charities.createIndex({
        "name": 1
    });
    await collections.job_groups.createIndex({
        "name": 1
    });
    await collections.jobs.createIndex({
        "name": 1
    });
    await collections.majors.createIndex({
        "name": 1
    });
    await collections.countries.createIndex({
        "name": 1
    });
}
