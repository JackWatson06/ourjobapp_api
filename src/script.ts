import bootstrap from "./bootstrap/dependencies";
import * as mongoDb from "db/MongoDb";

/**
 * Create the environment in which we will be running all scripts under. Take the name of the script we want to execute
 * as the argument to the method. At some point we will want to think about merging this with the default bootstrapping code
 * of the application.
 */
async function bootstrapScriptEnviornment(script: string)
{
    await bootstrap();

    try
    {
        console.log(`Executing ${script}`);
        const start = Date.now();
        const exec = await import(`${script}`);

        await exec.default();
        const elapsedMilli = Date.now() - start;
        console.log(`Finished Executing -- ${elapsedMilli / 1000}s`);
    }
    finally
    {           
        await mongoDb.close();
    }
}


// Grab the first agurment to the script
if(process.argv.length != 3)
{
    throw new Error("Please pass in the script you desire to run. You may only pass in one script!");
}

bootstrapScriptEnviornment(process.argv[2]);
