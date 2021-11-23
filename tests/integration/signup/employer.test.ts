import request           from "supertest";
import fs                from "fs";
import app               from "bootstrap/app";
import * as MongoDb      from "infa/MongoDb";
import * as  Collections from "Collections";

jest.setTimeout(30000);

const db: MongoDb.MDb = MongoDb.db();

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

type EmailVerification = {
    token: string
};

afterAll(async () => {
    // Seed the database with fake data for this integration test of the system.
    await db.collection("employers").deleteMany({});
    await db.collection("tokens").deleteMany({});
    await db.collection("contracts").deleteMany({});
    await MongoDb.close();
});

/**
 * ===================
 * |    EMPLOYER     |
 * ===================
 */
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
        const response = await request(app).post(`/api/v1/signup/employers`).send(employerUpload);    
        
        // === Assert ===
        const employer: Collections.Employer|null = await db.collection("employers").findOne<Collections.Employer>({ email: "frodo@thering.com" });
        const contract: Collections.Contract|null = await db.collection("contracts").findOne<Collections.Contract>({ _id: employer?.contract_id})

        expect(response.status).toBe(200);
        expect(employer).not.toBe(null);
        expect(contract).not.toBe(null);

        if(employer != null && contract != null)
        {
            const expectedPath = `${__dirname}/../../../documents/contracts/${contract.fileName}`
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
            email        : "sam@thering.com"
        }
            
        await request(app).post(`/api/v1/signup/employers`).send(employerUpload);    
        
        const employer: Collections.Employer|null = await db.collection("employers").findOne<Collections.Employer>({ email: "sam@thering.com" });
        const token: Collections.Token|null       = await db.collection("tokens").findOne<Collections.Token>({ _id: employer?.token_id });

        const tokenVerification: EmailVerification = {
            token: token?.token ?? ""
        }   

        // === Execute ===
        const responseVerify = await request(app).post(`/api/v1/signup/employers/verify`).send(tokenVerification);    

        // === Assert ===
        const verifiedEmployer: Collections.Employer|null = await db.collection("employers").findOne<Collections.Employer>({ email: "sam@thering.com" }); 
        const consumedToken: Collections.Token|null       = await db.collection("tokens").findOne<Collections.Token>({ _id: verifiedEmployer?.token_id }); 

        expect(responseVerify.status).toBe(200);
        expect(verifiedEmployer).not.toBe(null);
        expect(verifiedEmployer?.verified).toBe(true);
        expect(consumedToken?.consumed).toBe(true);
    });
});
