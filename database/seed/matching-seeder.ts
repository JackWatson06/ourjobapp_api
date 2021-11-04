
import * as MongoDb from "infa/MongoDb";
import * as C       from "infa/Constants";
import * as Col     from "Collections";

import { ObjectId } from "mongodb";


async function findJobGroup(db: MongoDb.MDb, collection: string, search: string): Promise<ObjectId>
{
    return await (await db.collection(collection).findOne({ name: search}))?._id ?? new ObjectId("617f2cdff6674c4c9b1471db")
}

export default async function exec()
{
    const db: MongoDb.MDb = MongoDb.db();

    // Create a token which we need to create an employer, and employee just given how the current db is structured to 
    // not have the verified users and the unverified users in seperate databases.
    const token: ObjectId = ( await db.collection("tokens").insertOne({
        token: "Null",
        expired_at: 0,
        created_at: 0
    }) ).insertedId;


    // Countries
    const unitedStatesId: ObjectId = await findJobGroup( db, "countries", "United States" );
    const southKoreaId: ObjectId = await findJobGroup( db, "countries", "South Korea" );
    const austrailiaId: ObjectId = await findJobGroup( db, "countries", "Australia" );

    // Job Groups
    const aerspaceEngineersId: ObjectId = await findJobGroup( db, "jobGroups", "Aerospace Engineers" );
    const graphicDesignerId: ObjectId   = await findJobGroup( db, "jobGroups", "Graphic Designers" );
    const financialAnalystId: ObjectId  = await findJobGroup( db, "jobGroups", "Financial Analysts" );
    const financialManagerId: ObjectId  = await findJobGroup( db, "jobGroups", "Financial Managers" );

    // Jobs
    const aircraftEngineer: ObjectId    = await findJobGroup( db, "jobs", "Aircraft Engineers" );
    const aerodynamicEngineer: ObjectId = await findJobGroup( db, "jobs", "Aerodynamic Engineers" );
    const graphicArtist: ObjectId       = await findJobGroup( db, "jobs", "Graphic Artists" );
    const visualDesigner: ObjectId      = await findJobGroup( db, "jobs", "Visual Designers" );
    const investmentAnalyst: ObjectId   = await findJobGroup( db, "jobs", "Investment Analysts" );
    const cityTreasurer: ObjectId       = await findJobGroup( db, "jobs", "City Treasurers" );
    const rocketEngineer: ObjectId      = await findJobGroup( db, "jobs", "Rocket Engineers" );

    
    const employers: Array<Col.Employer> = [ 
        {
            token_id     : token,
            fname        : "Employer One",
            lname        : "Employer One",
            position     : "Manager",
            company_name : "SpaceX",
            verified     : true,
            email        : "watson.jack.p@gmail.com",
            industry     : [ aerspaceEngineersId ],
            place_id     : "ChIJ8S7MWiu0woARAbM4zB1xwWI", // <= Hawthorne California
            experience   : [ C.Experience.INTERMEDIATE, C.Experience.EXPERIENCED ],
            salary       : 50, // Less than 50
            commitment   : C.Commitment.FULL_TIME,
            where        : C.Where.IN_PERSON,
            authorized   : true,
        },
        {
            token_id     : token,
            fname        : "Employer Two",
            lname        : "Employer Two",
            position     : "Manager",
            company_name : "Berkshire",
            verified     : true,
            email        : "j.watson@americanlaborcompany.com",

            industry     : [ graphicDesignerId ],
            place_id     : "ChIJP3Sa8ziYEmsRUKgyFmh9AQM",                 // <= Sydney Australia
            experience   : [ C.Experience.INTERN, C.Experience.ENTRY ],
            salary       : 25, // Less than 25 
            commitment   : C.Commitment.PART_TIME,
            where        : C.Where.REMOTE,
            authorized   : false
        }// },
        // {
        //     token_id     : token,
        //     fname        : "Employer Three",
        //     lname        : "Employer Three",
        //     position     : "Manager",
        //     company_name : "Tesla",
        //     verified     : true,
        //     email        : "m.morgan@americanlaborcompany.com",

        //     industry     : [ financialAnalystId, financialManagerId ],
        //     place_id     : "ChIJS5dFe_cZTIYRj2dH9qSb7Lk",   // <= Texas United States
        //     experience   : [ C.Experience.ENTRY, C.Experience.INTERMEDIATE, C.Experience.EXPERIENCED ],
        //     salary       : 35,         
        //     commitment   : C.Commitment.BOTH,
        //     where        : C.Where.BOTH,
        //     authorized   : true
        // }
    ]


    const employees: Array<Col.Employee>= [
        
        {
            token_id      : token,
            fname         : "Employee 1",
            lname         : "Employer 1",
            information   : "Matches with Employer One",
            email         : "email@gmail.com",
            phone         : "000-000-0000",
            verified      : true,
            education     : 1, 
            place_id      : "ChIJkYgocFYl6IARJi7MRwF6Lo0",   // Thousand Oaks California
            job_id        : [ aircraftEngineer ],
            authorized    : [ unitedStatesId ],
            hourly_rate   : 45,
            commitment    : C.Commitment.BOTH,
            where         : C.Where.BOTH,
            distance      : C.Distance.TWO_HUNDRED_FIFTY_MILES,
            experience    : C.Experience.INTERMEDIATE
        },
        {
            token_id      : token,
            fname         : "Employee 2",
            lname         : "Employer 2",
            information   : "Matches with Employer One",
            email         : "email@gmail.com",
            phone         : "000-000-0000",
            verified      : true,
            education     : 1,
            nations       : [ unitedStatesId ],
            job_id        : [ aerodynamicEngineer ],
            authorized    : [ unitedStatesId ],
            hourly_rate   : 50,
            commitment    : C.Commitment.FULL_TIME,
            where         : C.Where.IN_PERSON,
            distance      : C.Distance.NATIONALLY,
            experience    : C.Experience.EXPERIENCED
        },
        {
            token_id      : token,
            fname         : "Employee 3",
            lname         : "Employer 3",
            information   : "Matches with Employer Two",
            email         : "email@gmail.com",
            phone         : "000-000-0000",
            verified      : true,
            education     : 1,
            place_id      : "ChIJm7oRy-tVZDURS9uIugCbJJE", // South Korea 
            job_id        : [ graphicArtist ],
            authorized    : [ southKoreaId ],
            hourly_rate   : 15,
            commitment    : C.Commitment.PART_TIME,
            where         : C.Where.BOTH,
            distance      : C.Distance.WORLDWIDE,
            experience    : C.Experience.ENTRY
        },
        {
            token_id      : token,
            fname         : "Employee 4",
            lname         : "Employer 4",
            information   : "Matches with Employer Two",
            email         : "email@gmail.com",
            phone         : "000-000-0000",
            verified      : true,
            education     : 1,
            place_id      : "ChIJz6Z6bz-uEmsRNDpdSFfoGLE", // digiDirect Sydney
            job_id        : [ visualDesigner ],
            authorized    : [ austrailiaId, southKoreaId],
            hourly_rate   : 15,
            commitment    : C.Commitment.BOTH,
            where         : C.Where.BOTH,
            distance      : C.Distance.TEN_MILES,
            experience    : C.Experience.INTERN
        },
        {
            token_id      : token,
            fname         : "Employee 5",
            lname         : "Employer 5",
            information   : "Matches with Employer Three",
            email         : "email@gmail.com",
            phone         : "000-000-0000",
            verified      : true,
            education     : 1,
            place_id      : "ChIJkRHUB4GZToYR7UknaO8CkrU", // Kidd Springs Park Texas
            job_id        : [ investmentAnalyst],
            authorized    : [ unitedStatesId ],
            hourly_rate   : 25,
            commitment    : C.Commitment.FULL_TIME,
            where         : C.Where.IN_PERSON,
            distance      : C.Distance.ONE_HUNDRED_MILES,
            experience    : C.Experience.INTERMEDIATE
        },
        {
            token_id      : token,
            fname         : "Employee 6",
            lname         : "Employer 6",
            information   : "Matches with Employer One and Three",
            email         : "email@gmail.com",
            phone         : "000-000-0000",
            verified      : true,
            education     : 1,
            nations       : [ unitedStatesId ],   // List of country IDs from the database.
            job_id        : [ cityTreasurer, rocketEngineer ],
            authorized    : [ unitedStatesId],
            hourly_rate   : 35,
            commitment    : C.Commitment.FULL_TIME,
            where         : C.Where.IN_PERSON,
            distance      : C.Distance.NATIONALLY,
            experience    : C.Experience.EXPERIENCED
        }
    ]

    // Insert the employers
    for(const employer of employers)
    {
        await db.collection("employers").insertOne(employer);
    }
    
    // Insert the employees
    for(const employee of employees)
    {
        await db.collection("employees").insertOne(employee);
    }
}
