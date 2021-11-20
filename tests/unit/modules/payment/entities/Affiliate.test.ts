import Affiliate from "modules/payment/entities/Affiliate";
import Identification from "modules/payment/entities/Identification";
import Charity from "modules/payment/entities/Charity";


// Were only able to link
test("test you can only set an affiliate on time", () => {

    const identity: Identification = new Identification("111-111-1111", "EFEFefefEFEFefefEFEFefef");
    const charity: Charity = new Charity("EFEFefefEFEFefefEFEFefef")

    // Affilaites need to check to make sure that you can only nest one. If the affiliates aready have an affiliate don't nest. This allows
    // us to store the business rule that affiliates only get paid which are double down the chain.
    const affiliateOne: Affiliate   = new Affiliate(identity, charity);
    const affiliateTwo: Affiliate   = new Affiliate(identity, charity);
    const affiliateThree: Affiliate = new Affiliate(identity, charity)

    affiliateOne.linkAffiliate(affiliateTwo);
    affiliateTwo.linkAffiliate(affiliateThree);
    
    expect(affiliateTwo.getAffiliate()).toEqual(undefined);
});


test("single affiliate generates a payout", () => {
    
    const identity: Identification = new Identification("111-111-1111", "EFEFefefEFEFefefEFEFefef");
    const charity: Charity = new Charity("EFEFefefEFEFefefEFEFefef");

    // Affilaites need to check to make sure that you can only nest one. If the affiliates aready have an affiliate don't nest. This allows
    // us to store the business rule that affiliates only get paid which are double down the chain.
    const affiliateOne: Affiliate = new Affiliate(identity, charity);

    expect(affiliateOne.pay().length).toBe(1);
    
});

test("nested affiliates generate two payouts", () => {

    const identity: Identification = new Identification("111-111-1111", "EFEFefefEFEFefefEFEFefef");
    const charity: Charity = new Charity("EFEFefefEFEFefefEFEFefef");

    // Affilaites need to check to make sure that you can only nest one. If the affiliates aready have an affiliate don't nest. This allows
    // us to store the business rule that affiliates only get paid which are double down the chain.
    const affiliateOne: Affiliate = new Affiliate(identity, charity);
    const affiliateTwo: Affiliate = new Affiliate(identity, charity);

    affiliateOne.linkAffiliate(affiliateTwo);
    
    expect(affiliateOne.pay().length).toBe(2);
});

