// import request           from "supertest";
// import app               from "bootstrap/app";
import {close}      from "db/MongoDb";
// import * as  Collections from "db/DatabaseSchema";

// const db: MongoDb.MDb = MongoDb.db();

// const employerId       = MongoDb.toObjectId("6185b8addcc00ea23a35b995");
// const employeeId       = MongoDb.toObjectId("6185b8addcc00ea23a35b996");
// const affiliateIdOne   = MongoDb.toObjectId("6185b8addcc00ea23a35b997");
// const affiliateIdTwo   = MongoDb.toObjectId("6185b8addcc00ea23a35b998");
// const affiliateIdThree = MongoDb.toObjectId("6185b8addcc00ea23a35b999");

afterAll(async () => {
    close();
})

// // Before we run all of the tests we will want to seed the database with expected values that would already exists.... i.e. seed with an affiliate, employee, and employer.
// beforeAll(async () => {

//     request(app);

//     // Seed the database with fake data for this integration test of the system.    
//     const employer: Collections.Employer = {
//         _id          : employerId,
//         affiliate_id : affiliateIdOne,
//         token_id     : MongoDb.generate(),
//         fname        : "Employer One",
//         lname        : "Employer One",
//         position     : "Manager",
//         company_name : "SpaceX",
//         verified     : true,
//         email        : "watson.jack.p@gmail.com",
//         industry     : [ MongoDb.generate() ],
//         place_id     : "ChIJ8S7MWiu0woARAbM4zB1xwWI", // <= Hawthorne California
//         experience   : [ 1, 1 ],
//         salary       : 50, // Less than 50
//         commitment   : 1,
//         where        : 1,
//         contract_id  : MongoDb.generate(),
//         authorized   : true,
//     }

//     const employee: Collections.Employee = {
//         _id           : employeeId,
//         affiliate_id  : affiliateIdTwo,
//         token_id      : MongoDb.generate(),
//         fname         : "Employee 1",
//         lname         : "Employer 1",
//         information   : "Matches with Employer One",
//         email         : "email@gmail.com",
//         phone         : "000-000-0000",
//         verified      : true,
//         education     : 1, 
//         place_id      : "ChIJkYgocFYl6IARJi7MRwF6Lo0",   // Thousand Oaks California
//         job_id        : [ MongoDb.generate() ],
//         authorized    : [ MongoDb.generate() ],
//         hourly_rate   : 45,
//         commitment    : 1,
//         where         : 1,
//         distance      : 1,
//         experience    : 1
//     }

//     const affiliates: Array< Collections.Affiliate > = [

//         {
//             _id          : affiliateIdOne,
//             token_id     : MongoDb.generate(),
//             name         : "Robert",
//             charity_id   : MongoDb.generate(),
//             phone        : "111-111-1111",
//             verified     : true,
//             contract_id  : MongoDb.generate(),
//             created_at   : 0
//         },{
//             _id          : affiliateIdTwo,
//             affiliate_id : affiliateIdThree,
//             token_id     : MongoDb.generate(),
//             name         : "Mery",
//             charity_id   : MongoDb.generate(),
//             phone        : "111-111-1111",
//             verified     : true,
//             contract_id  : MongoDb.generate(),
//             created_at   : 0
//         },{
//             _id          : affiliateIdThree,
//             token_id     : MongoDb.generate(),
//             name         : "Shell",
//             charity_id   : MongoDb.generate(),
//             phone        : "111-111-1111",
//             verified     : true,
//             contract_id  : MongoDb.generate(),
//             created_at   : 0
//         }
//     ]

//     // Insert the employers
//     for(const affiliate of affiliates)
//     {
//         await db.collection("affiliates").insertOne(affiliate);
//     }

//     await db.collection("employers").insertOne(employer);
//     await db.collection("employees").insertOne(employee);
// });

// afterAll(async () => {
//     // Seed the database with fake data for this integration test of the system.
//     await db.collection("payments").deleteMany({});
//     await db.collection("payouts").deleteMany({});
//     await db.collection("affiliates").deleteMany({});
//     await db.collection("employers").deleteMany({});
//     await db.collection("employees").deleteMany({});
//     MongoDb.close();
// });


// test("an employer can start a payment for an employee", () => {    
//     expect(1).toBe(1);
// });

// test("an employer successfully pay for an employee", () => {
//     expect(1).toBe(1);
// });

// test("payouts are created when an employer succesfully pays for an employee", () => {
//     expect(1).toBe(1);
// });

test("To Implement", () => {
    expect(1).toBe(1);
});



