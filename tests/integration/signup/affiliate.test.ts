import request          from "supertest";
import fs               from "fs";
import app              from "bootstrap/app";
import * as MongoDb     from "infa/MongoDb";
import * as Collections from "Collections";

jest.setTimeout(30000);

const db: MongoDb.MDb = MongoDb.db();

type AffiliateUpload = {
    name          : string,
    phone         : string,
    charity_id    : string,
    affiliate_id ?: string,
};

type PhoneVerification = {
    code: string
};

afterAll(async () => {
    // Seed the database with fake data for this integration test of the system.
    await db.collection("affiliates").deleteMany({});
    await db.collection("tokens").deleteMany({});
    await db.collection("contracts").deleteMany({});
    await MongoDb.close();
});


/**
 * ====================
 * |    AFFILIATE     |
 * ====================
 */
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
        const response = await request(app).post(`/api/v1/signup/affiliates`).send(affiliateUpload); 
        
        // === Assert ===
        const affiliate: Collections.Affiliate|null = await db.collection("affiliates").findOne<Collections.Affiliate>({ phone: "111-111-1111" }); 
        const token : Collections.Contract|null     = await db.collection("tokens").findOne<Collections.Contract>({ _id: affiliate?.token_id})
        const contract: Collections.Contract|null   = await db.collection("contracts").findOne<Collections.Contract>({ _id: affiliate?.contract_id})

        expect(response.status).toBe(200);
        expect(affiliate).not.toBe(null);
        expect(token).not.toBe(null);
        expect(contract).not.toBe(null);

        if(affiliate != null && contract != null)
        {
            const expectedPath = `${__dirname}/../../../documents/contracts/${contract.fileName}`
            expect( fs.existsSync(expectedPath) ).toBe(true);
        }
    });

    test("can verify", async () => {
        // === Setup ===
        const affiliateUpload: AffiliateUpload = {
            name       : "Bob",
            phone      : "111-111-1112",
            charity_id : "EFEFefefEFEFefefEFEFefef"
        }
        
        await request(app).post(`/api/v1/signup/affiliates`).send(affiliateUpload);    
        
        const affiliate: Collections.Affiliate|null = await db.collection("affiliates").findOne<Collections.Affiliate>({ phone : "111-111-1112", }); 
        const token: Collections.Token|null         = await db.collection("tokens").findOne<Collections.Token>({ _id: affiliate?.token_id });
    
        const tokenVerification: PhoneVerification = {
            code: token?.code ?? ""
        }        

        // === Execute ===
        const responseVerify = await request(app).post(`/api/v1/signup/affiliates/verify/${token?.token}`).send(tokenVerification);            

        // === Assert ===
        const verifiedAffiliate: Collections.Affiliate|null = await db.collection("affiliates").findOne<Collections.Affiliate>({ phone : "111-111-1112", }); 
        const consumedToken: Collections.Token|null         = await db.collection("tokens").findOne<Collections.Token>({ _id: affiliate?.token_id }); 

        expect(responseVerify.status).toBe(200);
        expect(verifiedAffiliate).not.toBe(null);
        expect(verifiedAffiliate?.verified).toBe(true);
        expect(consumedToken?.consumed).toBe(true);
    });

    // TEST WE CAN'T MAKE DUPLICATES ... That may be in the unit testing zone.
})
