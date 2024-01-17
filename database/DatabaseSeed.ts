import { collections } from "db/MongoDb";
import { loadCompressedJson } from "./services/CompressedLoader";

export default async function exec()
{
    try
    {
        await loadCompressedJson("charities",  "charities");
        await loadCompressedJson("countries",  "countries");
        await loadCompressedJson("job-groups", "job_groups");
        await loadCompressedJson("jobs",       "jobs");
        await loadCompressedJson("majors",     "majors");
    
        await collections.charities.createIndex({
            "name": "text"
        });
        await collections.job_groups.createIndex({
            "name": "text"
        });
        await collections.jobs.createIndex({
            "name": "text"
        });
        await collections.majors.createIndex({
            "name": "text"
        });
        await collections.countries.createIndex({
            "name": "text"
        });
    }
    catch(error)
    {
        console.log("Critical failure loading seed data.");
        console.error(error);
    }
    
}
