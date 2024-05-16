/**
 * This file holds the tests that we run to confirm that our searching module works. The whole point of the searching module
 * is to supply necessary lookups that the front-end needs during the signup process.
 */

import request       from "supertest";
import app           from "bootstrap/app";
import { collections, close, toObjectId } from "db/MongoDb";
import { Schema } from "db/DatabaseSchema";
import { Constants } from "db/Constants";


afterAll(async () => {
    // Seed the database with fake data for this integration test of the system.
    await collections.employees.deleteMany({});
    await collections.employers.deleteMany({});
    await collections.affiliates.deleteMany({});
    await close();
});



test("the affiliate name has not been used before.", async () => {

    // === Setup ===
    const affiliate: Schema.Affiliate = {
        name         : "Jack",
        phone        : "111-111-1111",
        signup_id    : toObjectId("EFEFefefEFEFefefEFEFefef"),
        charity_id   : toObjectId("EFEFefefEFEFefefEFEFefef"),
        created_at   : Date.now()
    };

    await collections.affiliates.insertOne(affiliate);

    // === Execute ===
    const response: request.Response = await request(app).get(`/api/v1/search/existing/affiliate`).query({ name: 'Robert' });
    
    // === Assert ===
    expect(response.status).toBe(200);
    expect(response.body.exists).toBe(false);
});


test("we can not use the new affiliate name.", async () => {
    // === Setup ===
    const affiliate: Schema.Affiliate = {
        name         : "JackWatson",
        phone        : "111-111-1111",
        signup_id    : toObjectId("EFEFefefEFEFefefEFEFefef"),
        charity_id   : toObjectId("EFEFefefEFEFefefEFEFefef"),
        created_at   : Date.now()
    };

    await collections.affiliates.insertOne(affiliate);

    // === Execute ===
    const response: request.Response = await request(app).get(`/api/v1/search/existing/affiliate`).query({ name: 'JackWatson' });
    
    // === Assert ===
    expect(response.status).toBe(200);
    expect(response.body.exists).toBe(true);
});

test("the employer email has not been used before.", async () => {
    // === Setup ===
    const employer: Schema.Employer = {
        fname        : "Jack",
        lname        : "Watson",
        position     : "Manager",
        company_name : "SpaceX",
        email        : "watson.jack.p@gmail.com",
        industry     : [ toObjectId("EFEFefefEFEFefefEFEFefef") ],
        place_id     : "ChIJ8S7MWiu0woARAbM4zB1xwWI",
        experience   : [ Constants.Experience.INTERMEDIATE, Constants.Experience.EXPERIENCED ],
        salary       : 50, // Less than 50
        commitment   : Constants.Commitment.FULL_TIME,
        where        : Constants.Where.IN_PERSON,
        authorized   : true,
        signup_id    : toObjectId("EFEFefefEFEFefefEFEFefef"),
        created_at   : Date.now()
    };

    await collections.employers.insertOne(employer);

    // === Execute ===
    const response: request.Response = await request(app).get(`/api/v1/search/existing/employer`).query({ email: 'robert@gmail.com' }); 
    
    // === Assert ===
    expect(response.status).toBe(200);
    expect(response.body.exists).toBe(false);
});

test("we can not use the new employer email.", async () => {
    // === Setup ===
    const employer: Schema.Employer = {
        fname        : "Jack",
        lname        : "Watson",
        position     : "Manager",
        company_name : "SpaceX",
        email        : "robert@gmail.com",
        industry     : [ toObjectId("EFEFefefEFEFefefEFEFefef") ],
        place_id     : "ChIJ8S7MWiu0woARAbM4zB1xwWI",
        experience   : [ Constants.Experience.INTERMEDIATE, Constants.Experience.EXPERIENCED ],
        salary       : 50, // Less than 50
        commitment   : Constants.Commitment.FULL_TIME,
        where        : Constants.Where.IN_PERSON,
        authorized   : true,
        signup_id    : toObjectId("EFEFefefEFEFefefEFEFefef"),
        created_at   : Date.now()
    };

    await collections.employers.insertOne(employer);

    // === Execute ===
    const response: request.Response = await request(app).get(`/api/v1/search/existing/employer`).query({ email: 'robert@gmail.com' }); 
    
    // === Assert ===
    expect(response.status).toBe(200);
    expect(response.body.exists).toBe(true);
});

test("the employee phone number has not been used before.", async () => {
    // === Setup ===
    const employee: Schema.Employee = {
        fname         : "Jack",
        lname         : "Watson",
        information   : "Matches with Employer One",
        email         : "email@gmail.com",
        phone         : "+1 (716)-771-8154",
        education     : 1, 
        place_id      : "ChIJkYgocFYl6IARJi7MRwF6Lo0",   // Thousand Oaks California
        job_id        : [ toObjectId("EFEFefefEFEFefefEFEFefef") ],
        authorized    : [ toObjectId("EFEFefefEFEFefefEFEFefef") ],
        hourly_rate   : 45,
        commitment    : Constants.Commitment.BOTH,
        where         : Constants.Where.BOTH,
        distance      : Constants.Distance.TWO_HUNDRED_FIFTY_MILES,
        experience    : Constants.Experience.INTERMEDIATE,

        signup_id    : toObjectId("EFEFefefEFEFefefEFEFefef"),
        created_at   : Date.now()
    };

    await collections.employees.insertOne(employee);

    // === Execute ===
    const response: request.Response = await request(app).get(`/api/v1/search/existing/employee`).query({ phone: '+1 (564)-030-2030' }); 
    
    // === Assert ===
    expect(response.status).toBe(200);
    expect(response.body.exists).toBe(false);
});

test("we can not use the new employee number.", async () => {
    // === Setup ===
    const employee: Schema.Employee = {
        fname         : "Jack",
        lname         : "Watson",
        information   : "Matches with Employer One",
        email         : "email@gmail.com",
        phone         : "+1 (564)-030-2030",
        education     : 1, 
        place_id      : "ChIJkYgocFYl6IARJi7MRwF6Lo0",   // Thousand Oaks California
        job_id        : [ toObjectId("EFEFefefEFEFefefEFEFefef") ],
        authorized    : [ toObjectId("EFEFefefEFEFefefEFEFefef") ],
        hourly_rate   : 45,
        commitment    : Constants.Commitment.BOTH,
        where         : Constants.Where.BOTH,
        distance      : Constants.Distance.TWO_HUNDRED_FIFTY_MILES,
        experience    : Constants.Experience.INTERMEDIATE,

        signup_id    : toObjectId("EFEFefefEFEFefefEFEFefef"),
        created_at   : Date.now()
    };

    await collections.employees.insertOne(employee);

    // === Execute ===
    const response: request.Response = await request(app).get(`/api/v1/search/existing/employee`).query({ phone: '+1 (564)-030-2030' }); 
    
    // === Assert ===
    expect(response.status).toBe(200);
    expect(response.body.exists).toBe(true);
});
