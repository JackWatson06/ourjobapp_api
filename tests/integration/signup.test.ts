import request           from "supertest";
import fs                from "fs";
import app               from "bootstrap/app";
import * as MongoDb      from "infa/MongoDb";
import * as  Collections from "Collections";

const db: MongoDb.MDb = MongoDb.db();

type AffiliateUpload = {
    name          : string,
    email         : string,
    charity_id    : string,
    affiliate_id ?: string,
};

type EmployeeUpload = {
    place_id      : string,

    fname         : string
    lname         : string
    job_id        : string[],
    authorized    : string[],
    resume_id     : string,
    hourly_rate   : number,
    commitment    : number,
    where         : number,
    distance      : number,
    education     : number,
    experience    : number,
    information   : string,
    email         : string,
    phone         : string
};

type EmployerUpload = {
    fname        : string
    lname        : string
    position     : string,
    company_name : string,
    place_id     : string,
    industry     : string[],
    experience   : number[],
    salary       : number,
    commitment   : number,
    where        : number,
    authorized   : boolean,
    email        : string
};

afterAll(async () => {
    // Seed the database with fake data for this integration test of the system.
    await db.collection("affiliates").deleteMany({});
    await db.collection("employees").deleteMany({});
    await db.collection("resumes").deleteMany({});
    MongoDb.close();
});


test("you can signup as an affiliate", async () => {
    
    // === Setup ===
    const affiliateUpload: AffiliateUpload = {
        name: "Jack",
        email: "testing@gmail.com",
        charity_id: "EFEFefefEFEFefefEFEFefef",
        affiliate_id: "EFEFefefEFEFefefEFEFefef"
    }
    
    // === Execute ===
    const response = await request(app)
                            .post(`/api/v1/signup/affiliates`)
                            .send(affiliateUpload);    
    
    // === Assert ===
    expect(response.status).toBe(200);
    expect( async () => await db.collection("affiliates").findOne({ email: "testing@gmail.com" }) ).not.toBe(null);
});

test("you can sign up as employee", async () => {

    // === Setup ===
    const employeeUpload: EmployeeUpload = {
        place_id      : "EFEFefefEFEF",

        fname         : "Joe",
        lname         : "Schmoe",
        job_id        : ["EFEFefefEFEFefefEFEFefef", "EFEFefefEFEFefefEFEFefef"],
        authorized    : ["EFEFefefEFEFefefEFEFefef", "EFEFefefEFEFefefEFEFefef"],
        resume_id     : "EFEFefefEFEFefefEFEFefef",
        hourly_rate   : 34,
        commitment    : 1,
        where         : 1,
        distance      : 1,
        education     : 1,
        experience    : 1,
        information   : "",
        email         : "testing@gmail.com",
        phone         : "111-111-1111"
    }
    
    // === Execute ===
    const response = await request(app)
                            .post(`/api/v1/signup/employees`)
                            .send(employeeUpload);    
    
    // === Assert ===
    expect(response.status).toBe(200);
    expect( async () => await db.collection("employees").findOne({ email: "testing@gmail.com" }) ).not.toBe(null);
});

test("we can upload a resume to the server", async () => {

    // === Setup ===    
    const filePath = __dirname + "/../data/Jack_Watson_Resume.pdf"

    // === Execute ===
    const response = await request(app)
                            .post(`/api/v1/signup/resumes`)
                            .attach('resume', filePath);  
    
    // === Assert ===
    const resume: Collections.Resume|null = await db.collection("resumes").findOne<Collections.Resume>({ name: "Jack_Watson_Resume.pdf" });
    
    // Check we return correct response here as well with the identifier.
    expect( response.status ).toBe(200);
    expect( resume ).not.toBe(null);
    expect( response.body.id ).not.toBe(undefined);

    if(resume != null)
    {
        const expectedPath = `${__dirname}/../../documents/resumes/${resume.token}`
        expect( fs.existsSync(expectedPath) ).toBe(true);
    }
});

test("you can sign up as employer", async () => {

    // === Setup ===
    const employeeUpload: EmployerUpload = {
        fname        : "Frodo",
        lname        : "Baggans",
        position     : "Manager",
        company_name : "Bagend",
        place_id     : "HILL12345332",
        industry     : ["EFEFefefEFEFefefEFEFefef"],
        experience   : [1],
        salary       : 56,
        commitment   : 1,
        where        : 2,
        authorized   : true,
        email        : "frodo@thering.com"
    }
    
    // === Execute ===
    const response = await request(app)
                            .post(`/api/v1/signup/employers`)
                            .send(employeeUpload);    
    
    // === Assert ===
    expect(response.status).toBe(200);
    expect( async () => await db.collection("employers").findOne({ email: "frodo@thering.com" }) ).not.toBe(null);
});
