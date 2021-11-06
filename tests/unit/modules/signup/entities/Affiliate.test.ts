/**
 * Maybe one day we will use this function but not now.
 */



// import Resume from "modules/signup/entities/Resume";
// import Affiliate from "modules/signup/entities/Affiliate";
// import Email from "modules/signup/entities/Email";
// import Token from "modules/signup/entities/Token";

// // Affiliate validator this should be moved to a domain object (not the validator but rather the idea of the signup.)
// import { NewAffiliate } from "modules/signup/validators/NewAffiliateValidator";

// test("can add a resume to an affiliate", () => {

//     // === Setup ===
//     const email: Email = new Email("robert@gmail.com", new Token("123", 0));
//     const affiliate: Affiliate = new Affiliate({
//         name          : "Robert",
//         email         : "robert@gmail.com",
//         charity_id    : "EFEFefefEFEFefefEFEFefef"
//     }, email );

//     const resume: Resume = new Resume("12312312312", "xml/pdf", "34Mb");

//     // === Execute ===
//     affiliate.addResume(resume);

//     expect(affiliate.getResume()).toEqual(resume);
// });
