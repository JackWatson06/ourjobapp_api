import request       from "supertest";
import fs            from "fs";
import app           from "bootstrap/app";
import { collections, close, toObjectId } from "db/MongoDb";
import { Schema } from "db/DatabaseSchema";
import { Constants } from "db/Constants";

type AffiliateUpload = {
    name          : string,
    phone         : string,
    charity_id    : string,
    affiliate_id ?: string,
};

type VerificationUpload = {
    secret : string,
    code   : number
};


afterAll(async () => {
    // Seed the database with fake data for this integration test of the system.
    await collections.signups.deleteMany({});
    await collections.affiliates.deleteMany({});
    await collections.tokens.deleteMany({});
    await collections.documents.deleteMany({});
    await close();
});


describe("affiliates", () => {
    test("can signup", async () => {

        // === Setup ===
        const affiliateUpload: AffiliateUpload = {
            name         : "Jack",
            phone        : "111-111-1111",
            charity_id   : "EFEFefefEFEFefefEFEFefef",
            affiliate_id : "EFEFefefEFEFefefEFEFefef"
        }
        
        // === Execute ===
        const signupResponse: request.Response = await request(app).post(`/api/v1/signup/affiliates`).send(affiliateUpload); 
        
        // === Assert ===
        expect(signupResponse.status).toBe(200);
        expect(signupResponse.body.id).not.toBe(null);

        const signup: Schema.Signup|null = await collections.signups.findOne({ _id: toObjectId(signupResponse.body.id) }); 
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
        expect( fs.existsSync( `${__dirname}/../../../documents/${contract?.path}`) ).toBe(true);
    });


    test("can be verified.", async () => {
        // === Setup ===
        const affiliateUpload: AffiliateUpload = {
            name         : "Jack",
            phone        : "111-111-1112",
            charity_id   : "EFEFefefEFEFefefEFEFefef",
            affiliate_id : "EFEFefefEFEFefefEFEFefef"
        }

        const signupResponse: request.Response = await request(app).post(`/api/v1/signup/affiliates`).send(affiliateUpload);
        const token: Schema.Token|null = await collections.tokens.findOne({ signup_id: toObjectId(signupResponse.body.id)});
        
        const response: request.Response = await request(app).patch(`/api/v1/signup/verify/${signupResponse.body.id}`).send({
            code   : token?.code ?? 0
        });
        
        // === Assert ===
        const affiliate: Schema.Affiliate|null = await collections.affiliates.findOne({ phone: "111-111-1112"});
        const contract: Schema.Document|null = await collections.documents.findOne({ 
            resource_id   : affiliate?._id,
            resource      : Constants.Resource.AFFILIATE,
            type          : Constants.Document.CONTRACT
        });
        const consumedToken: Schema.Token|null = await collections.tokens.findOne({ signup_id: toObjectId(signupResponse.body.id)});

        expect(response.status).toBe(200);
        expect(affiliate).not.toBe(null);
        expect(contract).not.toBe(null);
        expect(consumedToken?.verified).toBe(true);
    });

    test("can view contract after signup.", async () => {

        // === Setup ===
        const affiliateUpload: AffiliateUpload = {
            name         : "Jack",
            phone        : "111-111-1111",
            charity_id   : "EFEFefefEFEFefefEFEFefef",
            affiliate_id : "EFEFefefEFEFefefEFEFefef"
        }
    
        const signupResponse: request.Response = await request(app).post(`/api/v1/signup/affiliates`).send(affiliateUpload); 
    
        // === Execute ===
        const contractResponse: request.Response = await request(app).get(`/api/v1/signup/${signupResponse.body.id}/contract`).send();

        // === Assert ===
        expect(contractResponse.status).toBe(200);
        expect(contractResponse.header["content-type"]).toBe("application/pdf");
    });

    test("can resend a verification code", async () => {

        // === Setup ===
        const affiliateUpload: AffiliateUpload = {
            name         : "Jack",
            phone        : "111-111-1111",
            charity_id   : "EFEFefefEFEFefefEFEFefef",
            affiliate_id : "EFEFefefEFEFefefEFEFefef"
        }
        
        const signupResponse: request.Response = await request(app).post(`/api/v1/signup/affiliates`).send(affiliateUpload); 
        const token: Schema.Token|null = await collections.tokens.findOne<Schema.Token>({ signup_id: toObjectId(signupResponse.body.id)});
        
        // === Execute ===
        const resendResponse: request.Response = await request(app).patch(`/api/v1/signup/${signupResponse.body.id}/resend`).send();

        // === Assert ===
        const resentToken: Schema.Token|null = await collections.tokens.findOne<Schema.Token>({ signup_id: toObjectId(signupResponse.body.id)});
    
        expect(resendResponse.status).toBe(200);
        expect(token?.code).not.toEqual(resentToken?.code);
        expect(token?.expired_at).toEqual(resentToken?.expired_at);
    })
    
    test("receive error on viewing contract after verification.", async () => {
    
       // === Setup ===
       const affiliateUpload: AffiliateUpload = {
        name         : "Jack",
        phone        : "111-111-1112",
        charity_id   : "EFEFefefEFEFefefEFEFefef",
        affiliate_id : "EFEFefefEFEFefefEFEFefef"
    }
    
        const signupResponse: request.Response = await request(app).post(`/api/v1/signup/affiliates`).send(affiliateUpload);
        const token: Schema.Token|null = await collections.tokens.findOne<Schema.Token>({ signup_id: toObjectId(signupResponse.body.id)});
    
        await request(app).patch(`/api/v1/signup/verify/${signupResponse.body.id}`).send({
            code   : token?.code ?? 0
        });
    
        // === Execute ===
        const contractResponse: request.Response = await request(app).get(`/api/v1/signup/${signupResponse.body.id}/contract`).send();
    
        // === Assert ===
        expect(contractResponse.status).toBe(404);
    });
    
    test("receive error on resending after verification.", async () => {
    
        // === Setup ===
        const affiliateUpload: AffiliateUpload = {
            name         : "Jack",
            phone        : "111-111-1112",
            charity_id   : "EFEFefefEFEFefefEFEFefef",
            affiliate_id : "EFEFefefEFEFefefEFEFefef"
        }
    
        const signupResponse: request.Response = await request(app).post(`/api/v1/signup/affiliates`).send(affiliateUpload);
        const token: Schema.Token|null = await collections.tokens.findOne<Schema.Token>({ signup_id: toObjectId(signupResponse.body.id)});
    
        await request(app).patch(`/api/v1/signup/verify/${signupResponse.body.id}`).send({
            code   : token?.code ?? 0
        });

        // === Execute ===
        const resendResponse: request.Response = await request(app).patch(`/api/v1/signup/${signupResponse.body.id}/resend`).send();
        
        expect(resendResponse.status).toBe(503);
    });

});

