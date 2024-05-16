import {collections, toObjectId, ObjectId, now} from "db/MongoDb";
import {Constants}   from "db/Constants";
import {Schema}      from "db/DatabaseSchema";

async function findConstant(collection: string, search: string): Promise<ObjectId>
{
    return await (await collections[collection].findOne({ name: search}))?._id ?? new ObjectId("617f2cdff6674c4c9b1471db")
}

export default async function exec()
{
    // Create a token which we need to create an employer, and employee just given how the current db is structured to 
    // not have the verified users and the unverified users in seperate databases.

    // Countries
    const unitedStatesId: ObjectId = await findConstant( "countries", "United States" );
    const southKoreaId: ObjectId = await findConstant( "countries", "South Korea" );
    const austrailiaId: ObjectId = await findConstant( "countries", "Australia" );

    // Job Groups
    const aerspaceEngineersId: ObjectId = await findConstant( "job_groups", "Aerospace Engineers" );
    const graphicDesignerId: ObjectId   = await findConstant( "job_groups", "Graphic Designers" );
    const financialAnalystId: ObjectId  = await findConstant( "job_groups", "Financial Analysts" );
    const financialManagerId: ObjectId  = await findConstant( "job_groups", "Financial Managers" );

    // Jobs
    const aircraftEngineer: ObjectId    = await findConstant( "jobs", "Aircraft Engineers" );
    const aerodynamicEngineer: ObjectId = await findConstant( "jobs", "Aerodynamic Engineers" );
    const graphicArtist: ObjectId       = await findConstant( "jobs", "Graphic Artists" );
    const visualDesigner: ObjectId      = await findConstant( "jobs", "Visual Designers" );
    const investmentAnalyst: ObjectId   = await findConstant( "jobs", "Investment Analysts" );
    const cityTreasurer: ObjectId       = await findConstant( "jobs", "City Treasurers" );
    const rocketEngineer: ObjectId      = await findConstant( "jobs", "Rocket Engineers" );

    
    const employers: Array<Schema.Employer> = [ 
        {
            fname        : "Employer One",
            lname        : "Employer One",
            position     : "Manager",
            company_name : "SpaceX",
            email        : "watson.jack.p@gmail.com",
            industry     : [ aerspaceEngineersId ],
            place_id     : "ChIJ8S7MWiu0woARAbM4zB1xwWI", // <= Hawthorne California
            experience   : [ Constants.Experience.INTERMEDIATE, Constants.Experience.EXPERIENCED ],
            salary       : 50, // Less than 50
            commitment   : Constants.Commitment.FULL_TIME,
            where        : Constants.Where.IN_PERSON,
            authorized   : true,

            signup_id    : toObjectId("EFEFefefEFEFefefEFEFefef"),
            created_at   : now()
        },
        {
            fname        : "Employer Two",
            lname        : "Employer Two",
            position     : "Manager",
            company_name : "Berkshire",
            email        : "j.watson@americanlaborcompany.com",
            industry     : [ graphicDesignerId ],
            place_id     : "ChIJP3Sa8ziYEmsRUKgyFmh9AQM",                 // <= Sydney Australia
            experience   : [ Constants.Experience.INTERN, Constants.Experience.ENTRY ],
            salary       : 25, // Less than 25 
            commitment   : Constants.Commitment.PART_TIME,
            where        : Constants.Where.REMOTE,
            authorized   : false,

            signup_id    : toObjectId("EFEFefefEFEFefefEFEFefef"),
            created_at   : now()
        },
        {
            fname        : "Employer Three",
            lname        : "Employer Three",
            position     : "Manager",
            company_name : "Tesla",
            email        : "jpw2065@g.rit.com",
            industry     : [ financialAnalystId, financialManagerId ],
            place_id     : "ChIJS5dFe_cZTIYRj2dH9qSb7Lk",   // <= Texas United States
            experience   : [ Constants.Experience.ENTRY, Constants.Experience.INTERMEDIATE, Constants.Experience.EXPERIENCED ],
            salary       : 35,         
            commitment   : Constants.Commitment.BOTH,
            where        : Constants.Where.BOTH,
            authorized   : true,

            signup_id    : toObjectId("EFEFefefEFEFefefEFEFefef"),
            created_at   : now()
        }
    ]


    const employees: Array<Schema.Employee>= [
        
        {
            fname         : "Employee 1",
            lname         : "Employer 1",
            information   : "Matches with Employer One",
            email         : "email@gmail.com",
            phone         : "000-000-0000",
            education     : 1, 
            place_id      : "ChIJkYgocFYl6IARJi7MRwF6Lo0",   // Thousand Oaks California
            job_id        : [ aircraftEngineer ],
            authorized    : [ unitedStatesId ],
            hourly_rate   : 45,
            commitment    : Constants.Commitment.BOTH,
            where         : Constants.Where.BOTH,
            distance      : Constants.Distance.TWO_HUNDRED_FIFTY_MILES,
            experience    : Constants.Experience.INTERMEDIATE,

            signup_id    : toObjectId("EFEFefefEFEFefefEFEFefef"),
            created_at   : now()
        },
        {
            fname         : "Employee 2",
            lname         : "Employer 2",
            information   : "Matches with Employer One",
            email         : "email@gmail.com",
            phone         : "000-000-0000",
            education     : 1,
            nations       : [ unitedStatesId ],
            job_id        : [ aerodynamicEngineer ],
            authorized    : [ unitedStatesId ],
            hourly_rate   : 50,
            commitment    : Constants.Commitment.FULL_TIME,
            where         : Constants.Where.IN_PERSON,
            distance      : Constants.Distance.NATIONWIDE,
            experience    : Constants.Experience.EXPERIENCED,

            signup_id    : toObjectId("EFEFefefEFEFefefEFEFefef"),
            created_at   : now()
        },
        {
            fname         : "Employee 3",
            lname         : "Employer 3",
            information   : "Matches with Employer Two",
            email         : "email@gmail.com",
            phone         : "000-000-0000",
            education     : 1,
            place_id      : "ChIJm7oRy-tVZDURS9uIugCbJJE", // South Korea 
            job_id        : [ graphicArtist ],
            authorized    : [ southKoreaId ],
            hourly_rate   : 15,
            commitment    : Constants.Commitment.PART_TIME,
            where         : Constants.Where.BOTH,
            distance      : Constants.Distance.WORLDWIDE,
            experience    : Constants.Experience.ENTRY,

            signup_id    : toObjectId("EFEFefefEFEFefefEFEFefef"),
            created_at   : now()
        },
        {
            fname         : "Employee 4",
            lname         : "Employer 4",
            information   : "Matches with Employer Two",
            email         : "email@gmail.com",
            phone         : "000-000-0000",
            education     : 1,
            place_id      : "ChIJz6Z6bz-uEmsRNDpdSFfoGLE", // digiDirect Sydney
            job_id        : [ visualDesigner ],
            authorized    : [ austrailiaId, southKoreaId],
            hourly_rate   : 15,
            commitment    : Constants.Commitment.BOTH,
            where         : Constants.Where.BOTH,
            distance      : Constants.Distance.TWENTY_FIVE_MILES,
            experience    : Constants.Experience.INTERN,

            signup_id    : toObjectId("EFEFefefEFEFefefEFEFefef"),
            created_at   : now()
        },
        {
            fname         : "Employee 5",
            lname         : "Employer 5",
            information   : "Matches with Employer Three",
            email         : "email@gmail.com",
            phone         : "000-000-0000",
            education     : 1,
            place_id      : "ChIJkRHUB4GZToYR7UknaO8CkrU", // Kidd Springs Park Texas
            job_id        : [ investmentAnalyst],
            authorized    : [ unitedStatesId ],
            hourly_rate   : 25,
            commitment    : Constants.Commitment.FULL_TIME,
            where         : Constants.Where.IN_PERSON,
            distance      : Constants.Distance.ONE_HUNDRED_MILES,
            experience    : Constants.Experience.INTERMEDIATE,

            signup_id    : toObjectId("EFEFefefEFEFefefEFEFefef"),
            created_at   : now()
        },
        {
            fname         : "Employee 6",
            lname         : "Employer 6",
            information   : "Matches with Employer One and Three",
            email         : "email@gmail.com",
            phone         : "000-000-0000",
            education     : 1,
            nations       : [ unitedStatesId ],   // List of country IDs from the database.
            job_id        : [ cityTreasurer, rocketEngineer ],
            authorized    : [ unitedStatesId],
            hourly_rate   : 35,
            commitment    : Constants.Commitment.FULL_TIME,
            where         : Constants.Where.IN_PERSON,
            distance      : Constants.Distance.NATIONWIDE,
            experience    : Constants.Experience.EXPERIENCED,

            signup_id    : toObjectId("EFEFefefEFEFefefEFEFefef"),
            created_at   : now()
        }
    ]

    // Insert the employers
    for(const employer of employers)
    {
        await collections.employers.insertOne(employer);
    }
    
    // Insert the employees
    for(const employee of employees)
    {
        await collections.employees.insertOne(employee);
    }
}
