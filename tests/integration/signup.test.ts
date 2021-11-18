import request           from "supertest";
import fs                from "fs";
import app               from "bootstrap/app";
import * as MongoDb      from "infa/MongoDb";
import * as  Collections from "Collections";

jest.setTimeout(30000);

const db: MongoDb.MDb = MongoDb.db();

type AffiliateUpload = {
    name          : string,
    phone         : string,
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

type Verification = {
    token: string
};

afterAll(async () => {
    // Seed the database with fake data for this integration test of the system.
    await db.collection("affiliates").deleteMany({});
    await db.collection("employees").deleteMany({});
    await db.collection("resumes").deleteMany({});
    await MongoDb.close();
});

describe("affiliates", () => {
    test("can signup", async () => {

        // === Setup ===
        const affiliateUpload: AffiliateUpload = {
            name: "Jack",
            phone: "111-111-1111",
            charity_id: "EFEFefefEFEFefefEFEFefef",
            affiliate_id: "EFEFefefEFEFefefEFEFefef"
        }
        
        // === Execute ===
        const response = await request(app)
                                .post(`/api/v1/signup/affiliates`)
                                .send(affiliateUpload); 
        
        // === Assert ===
        const affiliate: Collections.Affiliate|null = await db.collection("affiliates").findOne<Collections.Affiliate>({ email: "testing@gmail.com" }); 

        expect(response.status).toBe(200);
        expect(affiliate).not.toBe(null);

        if(affiliate != null)
        {
            const expectedPath = `${__dirname}/../../documents/contracts/${affiliate.contract}`
            expect( fs.existsSync(expectedPath) ).toBe(true);
        }
    });

    test("can verify", async () => {

        // === Setup ===
        const affiliateUpload: AffiliateUpload = {
            name: "Bob",
            email: "bob@gmail.com",
            charity_id: "EFEFefefEFEFefefEFEFefef"
        }
        
        await request(app).post(`/api/v1/signup/affiliates`).send(affiliateUpload);    
        
        const affiliate: Collections.Affiliate|null = await db.collection("affiliates").findOne<Collections.Affiliate>({ email: "bob@gmail.com" }); 
        const token: Collections.Token|null = await db.collection("tokens").findOne<Collections.Token>({ _id: affiliate?.token_id });
        
        expect(token).not.toBe(null);

        const tokenVerification: Verification = {
            token: token?.token ?? ""
        }        

        // === Execute ===
        const responseVerify = await request(app).post(`/api/v1/signup/affiliates/verify`).send(tokenVerification);    

        expect(responseVerify.status).toBe(200);
        
        const verifiedAffiliate: Collections.Affiliate|null = await db.collection("affiliates").findOne<Collections.Affiliate>({ email: "bob@gmail.com" }); 

        expect(verifiedAffiliate).not.toBe(null);
        expect(verifiedAffiliate?.verified).toBe(true);
    });

    // TEST WE CAN'T MAKE DUPLICATES ... That may be in the unit testing zone.
})

describe("employee", () => {
    test("can sign up", async () => {

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
    
    test("employee can upload a resume to the server", async () => {
    
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
});


describe("employer", () => {

    test("can sign up", async () => {

        // === Setup ===
        const employerUpload: EmployerUpload = {
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
                                .send(employerUpload);    
        
        // === Assert ===
        const employer: Collections.Employer|null = await db.collection("employers").findOne<Collections.Employer>({ email: "frodo@thering.com" });

        expect(response.status).toBe(200);
        expect( employer ).not.toBe(null);

        if(employer != null)
        {
            const expectedPath = `${__dirname}/../../documents/contracts/${employer.contract}`
            expect( fs.existsSync(expectedPath) ).toBe(true);
        }
    });


    test("can be verified", async () => {

        // === Setup ===
        const employerUpload: EmployerUpload = {
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
        const response = await request(app).post(`/api/v1/signup/employers`).send(employerUpload);    
        
        // === Assert ===
        const employer: Collections.Employer|null = await db.collection("employers").findOne<Collections.Employer>({ email: "frodo@thering.com" });
        const token: Collections.Token|null = await db.collection("tokens").findOne<Collections.Token>({ _id: employer?.token_id });
        
        expect(token).not.toBe(null);

        const tokenVerification: Verification = {
            token: token?.token ?? ""
        }        

        // === Execute ===
        const responseVerify = await request(app).post(`/api/v1/signup/employers/verify`).send(tokenVerification);    

        expect(responseVerify.status).toBe(200);
        
        const verifiedEmployer: Collections.Employer|null = await db.collection("employers").findOne<Collections.Employer>({ email: "frodo@thering.com" }); 

        expect(verifiedEmployer).not.toBe(null);
        expect(verifiedEmployer?.verified).toBe(true);
    });
});