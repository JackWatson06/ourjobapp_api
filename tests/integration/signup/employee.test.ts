import request           from "supertest";
import fs                from "fs";
import app               from "bootstrap/app";
import * as MongoDb      from "db/MongoDb";
import * as  Collections from "db/DatabaseSchema";

jest.setTimeout(30000);

const db: MongoDb.MDb = MongoDb.db();

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

type PhoneVerification = {
    code: string
};

afterAll(async () => {
    // Seed the database with fake data for this integration test of the system.
    await db.collection("employees").deleteMany({});
    await db.collection("resumes").deleteMany({});
    await db.collection("tokens").deleteMany({});
    await MongoDb.close();
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
        const response = await request(app).post(`/api/v1/signup/employees`).send(employeeUpload);    
        
        // === Assert ===
        expect(response.status).toBe(200);
        expect( async () => await db.collection("employees").findOne({ phone: "111-111-1111" }) ).not.toBe(null);
    });

    test("can verify", async () => {
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
            email         : "testing2@gmail.com",
            phone         : "111-111-1112"
        }
        
        // === Execute ===
        await request(app).post(`/api/v1/signup/employees`).send(employeeUpload);    
        
        const employee: Collections.Employee|null = await db.collection("employees").findOne<Collections.Employee>({ phone : "111-111-1112", }); 
        const token: Collections.Token|null       = await db.collection("tokens").findOne<Collections.Token>({ _id: employee?.token_id });
    
        const tokenVerification: PhoneVerification = {
            code: token?.code ?? ""
        }

        // === Execute ===
        const responseVerify = await request(app).post(`/api/v1/signup/employees/verify/${token?.token}`).send(tokenVerification);            

        // === Assert ===
        const verifiedEmployee: Collections.Employee|null = await db.collection("employees").findOne<Collections.Employee>({ phone : "111-111-1112", }); 
        const consumedToken: Collections.Token|null       = await db.collection("tokens").findOne<Collections.Token>({ _id: verifiedEmployee?.token_id }); 

        expect(responseVerify.status).toBe(200);
        expect(verifiedEmployee).not.toBe(null);
        expect(verifiedEmployee?.verified).toBe(true);
        expect(consumedToken?.consumed).toBe(true);
    });
    
    test("can upload a resume to the server", async () => {
    
        // === Setup ===    
        const filePath = __dirname + "/../../data/Jack_Watson_Resume.pdf"
    
        // === Execute ===
        const response = await request(app).post(`/api/v1/signup/resumes`).attach('resume', filePath);  
        
        // === Assert ===
        const resume: Collections.Resume|null = await db.collection("resumes").findOne<Collections.Resume>({ name: "Jack_Watson_Resume.pdf" });
        
        // Check we return correct response here as well with the identifier.
        expect(response.status).toBe(200);
        expect(resume).not.toBe(null);
        expect(response.body.id).not.toBe(undefined);
    
        if(resume != null)
        {
            const expectedPath = `${__dirname}/../../../documents/resumes/${resume.token}`
            expect(fs.existsSync(expectedPath)).toBe(true);
        }
    });
});
