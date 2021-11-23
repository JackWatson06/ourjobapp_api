// import request           from "supertest";
// import fs                from "fs";
// import app               from "bootstrap/app";
// import * as MongoDb      from "infa/MongoDb";
// // import * as  Collections from "Collections";

// jest.setTimeout(30000);

// const db: MongoDb.MDb = MongoDb.db();

// type AffiliateUpload = {
//     name          : string,
//     phone         : string,
//     charity_id    : string,
//     affiliate_id ?: string,
// };

// type PhoneVerification = {
//     code: string
// };

// afterAll(async () => {
//     // Seed the database with fake data for this integration test of the system.
//     await db.collection("affiliates").deleteMany({});
//     await db.collection("tokens").deleteMany({});
//     await db.collection("contracts").deleteMany({});
//     await MongoDb.close();
// });



describe("contract", () => {

    test("can view after signup", () => {

    });

    test("test can not view if invalid", () => {

    });
});