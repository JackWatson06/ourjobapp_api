import request           from "supertest";
import app               from "bootstrap/app";
import * as MongoDb      from "infa/MongoDb";
import * as  Collections from "Collections";

const db: MongoDb.MDb = MongoDb.db();

const employerId = MongoDb.generate();
const employeeId = MongoDb.generate();
const affiliateIdOne = MongoDb.generate();
const affiliateIdTwo = MongoDb.generate();
const affiliateIdThree = MongoDb.generate();


// Before we run all of the tests we will want to seed the database with expected values that would already exists.... i.e. seed with an affiliate, employee, and employer.
beforeAll(async () => {

    request(app);

    // Seed the database with fake data for this integration test of the system.    
    const employer: Collections.Employer = {
        _id          : employerId,
        token_id     : MongoDb.generate(),
        fname        : "Employer One",
        lname        : "Employer One",
        position     : "Manager",
        company_name : "SpaceX",
        verified     : true,
        email        : "watson.jack.p@gmail.com",
        industry     : [ MongoDb.generate() ],
        place_id     : "ChIJ8S7MWiu0woARAbM4zB1xwWI", // <= Hawthorne California
        experience   : [ 1, 1 ],
        salary       : 50, // Less than 50
        commitment   : 1,
        where        : 1,
        authorized   : true,
    }

    const employee: Collections.Employee = {
        _id           : employeeId,
        token_id      : MongoDb.generate(),
        fname         : "Employee 1",
        lname         : "Employer 1",
        information   : "Matches with Employer One",
        email         : "email@gmail.com",
        phone         : "000-000-0000",
        verified      : true,
        education     : 1, 
        place_id      : "ChIJkYgocFYl6IARJi7MRwF6Lo0",   // Thousand Oaks California
        job_id        : [ MongoDb.generate() ],
        authorized    : [ MongoDb.generate() ],
        hourly_rate   : 45,
        commitment    : 1,
        where         : 1,
        distance      : 1,
        experience    : 1
    }

    const affiliates: Array< Collections.Affiliate > = [

        {
            _id        : affiliateIdOne,
            token_id   : MongoDb.generate(),
            name       : "Robert",
            charity_id : MongoDb.generate(),
            email      : "robert@gmail.com",
            verified   : true,
            created_at : 0
        },{
            _id        : affiliateIdTwo,
            token_id   : MongoDb.generate(),
            name       : "Mery",
            charity_id : MongoDb.generate(),
            email      : "mery@gmail.com",
            verified   : true,
            created_at : 0
        },{
            _id          : affiliateIdThree,
            affiliate_id : affiliateIdTwo,
            token_id     : MongoDb.generate(),
            name         : "Shell",
            charity_id   : MongoDb.generate(),
            email        : "shell@gmail.com",
            verified     : true,
            created_at   : 0
        }
    ]

    // Insert the employers
    for(const affiliate of affiliates)
    {
        await db.collection("affiliates").insertOne(affiliate);
    }

    await db.collection("employers").insertOne(employer);
    await db.collection("employees").insertOne(employee);
});


afterAll(async () => {
    // Seed the database with fake data for this integration test of the system.
    await db.collection("payments").deleteMany({});
    await db.collection("payouts").deleteMany({});
    await db.collection("affiliates").deleteMany({});
    await db.collection("employers").deleteMany({});
    await db.collection("employees").deleteMany({});
});

test("1 = 1", () => {
    expect(1).toBe(1);
})

