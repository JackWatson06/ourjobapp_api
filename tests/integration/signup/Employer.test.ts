import request from "supertest";
import fs from "fs";
import app from "bootstrap/app";
import { collections, close, toObjectId } from "db/MongoDb";
import { Schema } from "db/DatabaseSchema";
import { Constants } from "db/Constants"

jest.setTimeout(10000);

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
    await collections.employers.deleteMany({});
    await collections.tokens.deleteMany({});
    await collections.documents.deleteMany({});
    await collections.signups.deleteMany({});
    await collections.locations.deleteMany({});
    await close();
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
            place_id     : "PLACEID",
            industry     : ["EFEFefefEFEFefefEFEFefef"],
            experience   : [Constants.Experience.ENTRY],
            salary       : 56,
            commitment   : Constants.Where.IN_PERSON,
            where        : Constants.Where.BOTH,
            authorized   : true,
            email        : "testing1@gmail.com"
        }
        
        // === Execute ===
        const signupResponse = await request(app).post(`/api/v1/signup/employers`).send(employerUpload);    
        
        // === Assert ===
        expect(signupResponse.status).toBe(200);
        expect(signupResponse.body.id).not.toBe(null);

        const signup: Schema.Signup|null = await collections.signups.findOne({ _id: toObjectId(signupResponse.body.id) }); 
        const location: Schema.Location|null = await collections.locations.findOne({ place_id: "PLACEID" }); 
        const contract: Schema.Document|null = await collections.documents.findOne({ 
            resource_id   : toObjectId(signupResponse.body.id),
            resource      : Constants.Resource.SIGNUP,
            type          : Constants.Document.CONTRACT
        });
        const token: Schema.Token|null = await collections.tokens.findOne({ 
            signup_id: toObjectId(signupResponse.body.id)
        });

        expect(signup).not.toBe(null);
        expect(token).not.toBe(null);
        expect(contract).not.toBe(null);
        expect(location).not.toBe(null);
        expect( fs.existsSync( `${__dirname}/../../../documents/${contract?.path}`) ).toBe(true);
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
            email        : "testing2@gmail.com"
        }
            
        const signupResponse: request.Response = await request(app).post(`/api/v1/signup/employers`).send(employerUpload);    
        
        const token: Schema.Token|null = await collections.tokens.findOne({ 
            signup_id: toObjectId(signupResponse.body.id)
        });
        
        // === Execute ===
        const responseVerify = await request(app).patch(`/api/v1/signup/verify`).send({            
            secret: token?.secret ?? ""
        } );    

        // === Assert ===
        const employer: Schema.Employer|null = await collections.employers.findOne({ email: "testing2@gmail.com"});
        const contract: Schema.Document|null = await collections.documents.findOne({ 
            resource_id   : employer?._id,
            resource      : Constants.Resource.EMPLOYER,
            type          : Constants.Document.CONTRACT
        });
        const consumedToken: Schema.Token|null = await collections.tokens.findOne({ signup_id: toObjectId(signupResponse.body.id)});
    
        expect(responseVerify.status).toBe(200);
        expect(employer).not.toBe(null);
        expect(contract).not.toBe(null);
        expect(consumedToken?.verified).toBe(true);
    });
});