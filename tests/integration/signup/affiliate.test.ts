import request          from "supertest";
import fs               from "fs";
import app              from "bootstrap/app";
import * as MongoDb     from "db/MongoDb";
import * as Collections from "db/DatabaseSchema";

jest.setTimeout(30000);

const db: MongoDb.MDb = MongoDb.db();

type AffiliateUpload = {
    name          : string,
    phone         : string,
    charity_id    : string,
    affiliate_id ?: string,
};

type VerificationUpload = {
    code : string
};

afterAll(async () => {
    // Seed the database with fake data for this integration test of the system.
    await db.collection("signups").deleteMany({});
    await db.collection("affiliates").deleteMany({});
    await db.collection("tokens").deleteMany({});
    await db.collection("documents").deleteMany({});
    await MongoDb.close();
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

        const signup: Collections.Signup|null = await db.collection("signups").findOne<Collections.Signup>({ _id: signupResponse.body.id }); 
        const contract: Collections.Document|null = await db.collection("documents").findOne<Collections.Document>({ 
            resource_id: signupResponse.body.id,
            resource_type: 1,
            type: 1
        });
        const token: Collections.Token|null = await db.collection("tokens").findOne<Collections.Token>({ 
            signup_id: signupResponse.body.id
        });

        expect(signup).not.toBe(null);
        expect(token).not.toBe(null);
        expect(document).not.toBe(null);

        if(signup != null && signup != null)
        {
            const expectedPath = `${__dirname}/../../../documents/${document.fileName}`
            expect( fs.existsSync(expectedPath) ).toBe(true);
        }
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
        const token: Collections.Token|null = await db.collection("tokens").findOne<Collections.Token>({ signup_id: signupResponse.body.id});

        // === Execute ===
        const verificationUpload: VerificationUpload = {
            code: token?.code ?? ""
        }

        const response: request.Response = await request(app).post(`/api/v1/signup/verify/${signupResponse.body.id}`).send(verificationUpload);

        // === Assert ===
        const affiliate: Collections.Affiliate|null = await db.collection("affiliates").findOne<Collections.Affiliate>({ phone: "111-111-1112"});
        const consumedToken: Collections.Token|null = await db.collection("tokens").findOne<Collections.Token>({ signup_id: signupResponse.body.id});

        expect(response.status).toBe(200);

        expect(affiliate).not.toBe(null);
        expect(consumedToken?.consumed).toBe(true);
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
    
        const token: Collections.Token|null = await db.collection("tokens").findOne<Collections.Token>({ signup_id: signupResponse.body.id});
    
        // === Execute ===
        const resendResponse: request.Response = await request(app).patch(`/api/v1/signup/${signupResponse.body.id}/resend`).send();
    
        // === Assert ===
        const resentToken: Collections.Token|null = await db.collection("tokens").findOne<Collections.Token>({ signup_id: signupResponse.body.id});
    
        expect(resendResponse.status).toBe(200);
        expect(token?.code).not.toBe(resentToken?.code);
        expect(token?.expired_at).not.toBe(resentToken?.expired_at);
    
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
        const token: Collections.Token|null = await db.collection("tokens").findOne<Collections.Token>({ signup_id: signupResponse.body.id});
    
        const verificationUpload: VerificationUpload = {
            code: token?.code ?? ""
        }
    
        await request(app).post(`/api/v1/signup/verify/${signupResponse.body.id}`).send(verificationUpload);
    
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
        const token: Collections.Token|null = await db.collection("tokens").findOne<Collections.Token>({ signup_id: signupResponse.body.id});
    
        const verificationUpload: VerificationUpload = {
            code: token?.code ?? ""
        }
    
        await request(app).post(`/api/v1/signup/verify/${signupResponse.body.id}`).send(verificationUpload);
    
        // === Execute ===
        const resendResponse: request.Response = await request(app).patch(`/api/v1/signup/${signupResponse.body.id}/resend`).send();
    
        expect(resendResponse.status).toBe(404);
    });

});

