import * as MongoDb from "infa/MongoDb";
import load from "./services/load";

export default async function exec()
{
    await load("charities.json",  "charities");
    await load("countries.json",  "countries");
    await load("job-groups.json", "jobGroups");
    await load("jobs.json",       "jobs");
    await load("majors.json",     "majors");

    const db: MongoDb.MDb = MongoDb.db();

    await db.collection("charities").createIndex({
        "name": 1
    });
    await db.collection("jobGroups").createIndex({
        "name": 1
    });
    await db.collection("jobs").createIndex({
        "name": 1
    });
    await db.collection("majors").createIndex({
        "name": 1
    });
    await db.collection("countries").createIndex({
        "name": 1
    });
}
