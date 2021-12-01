/**
 * Original Author: Jack Watson
 * Created Date: 11/30/2021
 * Purpose: Test our signups for employeers to make sure they are working.
 */

import request       from "supertest";
import fs            from "fs";
import app           from "bootstrap/app";
import { collections, close, toObjectId } from "db/MongoDb";
import { Schema }             from "db/DatabaseSchema";
import { Constants }          from "db/Constants";

jest.setTimeout(10000);

type EmployeeUpload = {
    place_id      : string,

    fname         : string
    lname         : string
    job_id        : string[],
    authorized    : string[],
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

type PhoneVerification = {
    secret : string,
    code   : number
};

afterAll(async () => {
    // Seed the database with fake data for this integration test of the system.
    await collections.employees.deleteMany({});
    await collections.documents.deleteMany({});
    await collections.tokens.deleteMany({});
    await collections.signups.deleteMany({});
    await close();
});

/**
 * ===================
 * |    EMPLOYEE     |
 * ===================
 */
describe("employee", () => {
    test("can sign up", async () => {

        // === Setup ===
        const employeeUpload: EmployeeUpload = {
            place_id      : "EFEFefefEFEF",
            fname         : "Joe",
            lname         : "Schmoe",
            job_id        : ["EFEFefefEFEFefefEFEFefef", "EFEFefefEFEFefefEFEFefef"],
            authorized    : ["EFEFefefEFEFefefEFEFefef", "EFEFefefEFEFefefEFEFefef"],
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
        const signupResponse: request.Response = await request(app).post(`/api/v1/signup/employees`).send(employeeUpload);    
        
        // === Assert === 
        expect(signupResponse.status).toBe(200);
        expect(signupResponse.body.id).not.toBe(null);

        const signup: Schema.Signup|null = await collections.signups.findOne({ _id: toObjectId(signupResponse.body.id) }); 
        const token: Schema.Token|null = await collections.tokens.findOne({ 
            signup_id: toObjectId(signupResponse.body.id)
        });

        expect(signup).not.toBe(null);
        expect(token).not.toBe(null);
    });

    test("can sign up with a resume", async () => {
        // === Setup ===
        const filePath = __dirname + "/../../data/Jack_Watson_Resume.pdf"
        const employeeUpload: EmployeeUpload = {
            place_id      : "EFEFefefEFEF",
            fname         : "Joe",
            lname         : "Schmoe",
            job_id        : ["EFEFefefEFEFefefEFEFefef", "EFEFefefEFEFefefEFEFefef"],
            authorized    : ["EFEFefefEFEFefefEFEFefef", "EFEFefefEFEFefefEFEFefef"],
            hourly_rate   : 34,
            commitment    : 1,
            where         : 1,
            distance      : 1,
            education     : 1,
            experience    : 1,
            information   : "",
            email         : "testing@gmail.com",
            phone         : "111-111-1112"
        }
        
        // === Execute ===
        const signupResponse: request.Response = await request(app).post(`/api/v1/signup/employees`).send(employeeUpload);    
        const resumeResponse: request.Response = await request(app).post(`/api/v1/signup/employees/${signupResponse.body.id}/resume`).attach('resume', filePath);  

        // === Assert === 
        expect(resumeResponse.status).toBe(200);

        const resume: Schema.Document|null = await collections.documents.findOne({ 
            resource_id   : toObjectId(signupResponse.body.id),
            resource      : Constants.Resource.SIGNUP,
            type          : Constants.Document.RESUME
        });
        const expectedPath = `${__dirname}/../../../documents/${resume?.path}`;

        expect(resume).not.toBe(null);
        expect( fs.existsSync(expectedPath) ).toBe(true);
    });

    test("can verify", async () => {
        // === Setup ===
        const employeeUpload: EmployeeUpload = {
            place_id      : "EFEFefefEFEF",
    
            fname         : "Joe",
            lname         : "Schmoe",
            job_id        : ["EFEFefefEFEFefefEFEFefef", "EFEFefefEFEFefefEFEFefef"],
            authorized    : ["EFEFefefEFEFefefEFEFefef", "EFEFefefEFEFefefEFEFefef"],
            hourly_rate   : 34,
            commitment    : 1,
            where         : 1,
            distance      : 1,
            education     : 1,
            experience    : 1,
            information   : "",
            email         : "testing@gmail.com",
            phone         : "111-111-1113"
        }
        
        const signupResponse: request.Response = await request(app).post(`/api/v1/signup/employees`).send(employeeUpload);    
        const token: Schema.Token|null       = await collections.tokens.findOne({ signup_id: toObjectId(signupResponse.body.id)});
    
        const tokenVerification: PhoneVerification = {
            secret: token?.secret ?? "",
            code: token?.code ?? 0
        }

        // === Execute ===
        const responseVerify = await request(app).patch(`/api/v1/signup/verify`).send(tokenVerification);            

        // === Assert ===
        const verifiedEmployee: Schema.Employee|null = await collections.employees.findOne({ phone : "111-111-1113", }); 
        const consumedToken: Schema.Token|null       = await collections.tokens.findOne({ signup_id: toObjectId(signupResponse.body.id)});

        expect(responseVerify.status).toBe(200);
        expect(verifiedEmployee).not.toBe(null);
        expect(consumedToken?.verified).toBe(true);
    });
    

    test("can verify with resume", async () => {
        // === Setup ===
        const filePath = __dirname + "/../../data/Jack_Watson_Resume.pdf"
        const employeeUpload: EmployeeUpload = {
            place_id      : "EFEFefefEFEF",
            fname         : "Joe",
            lname         : "Schmoe",
            job_id        : ["EFEFefefEFEFefefEFEFefef", "EFEFefefEFEFefefEFEFefef"],
            authorized    : ["EFEFefefEFEFefefEFEFefef", "EFEFefefEFEFefefEFEFefef"],
            hourly_rate   : 34,
            commitment    : 1,
            where         : 1,
            distance      : 1,
            education     : 1,
            experience    : 1,
            information   : "",
            email         : "testing@gmail.com",
            phone         : "111-111-1114"
        }
        
        // === Execute ===
        const signupResponse: request.Response = await request(app).post(`/api/v1/signup/employees`).send(employeeUpload);    
        const token: Schema.Token|null       = await collections.tokens.findOne({ signup_id: toObjectId(signupResponse.body.id)});

        await request(app).post(`/api/v1/signup/employees/${signupResponse.body.id}/resume`).attach('resume', filePath);  

        // === Execute ===
        await request(app).patch(`/api/v1/signup/verify`).send({
            secret: token?.secret ?? "",
            code: token?.code ?? 0
        });    

        const verifiedEmployee: Schema.Employee|null = await collections.employees.findOne({ phone : "111-111-1114", }); 
        const resume: Schema.Document|null = await collections.documents.findOne({ 
            resource_id   : verifiedEmployee?._id,
            resource      : Constants.Resource.EMPLOYEE,
            type          : Constants.Document.RESUME
        });

        expect(resume).not.toBe(null);
    });

});

