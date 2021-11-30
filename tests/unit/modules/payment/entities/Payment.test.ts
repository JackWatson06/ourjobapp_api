// import PayPalApiAdaptor from "infa/PayPalApiAdaptor";

// jest.mock("infa/PayPalApiAdaptor");

// const MockPaymentProcessing = PayPalApiAdaptor as jest.Mock<typeof PayPalApiAdaptor> 

/**
 * How should we test that a pyament can only be used up once? If we pass in another payment id we should not 
 * be able to even get the payment... thats almost like permissions tbh. Maybe thats an integration test.
 * 
 * What also stops an individual from sending a post with a correct employeeId and employerId to the /payment
 * route then they also after they get redirected to the payment screen send a request to the success endpoint.
 * We need to generate some token internally. Maybe we need to generate a token internally then see if the paypayl
 * API token matches. Or JWT token might work for that?
 * 
 * 
 * If error and success are both false than that means the payout has yet to be sent.
 * 
 */
import Payment from "modules/payment/entities/Payment";
import Affiliate from "modules/payment/entities/Affiliate";
import Identification from "modules/payment/entities/Identification";
import Charity from "modules/payment/entities/Charity";

import PayPalAdaptor from "payment/PayPalAdaptor";

jest.mock("infa/PayPalAdaptor");

// Affiliates can be added to a payment so they can get access to the payout.
test("can add affiliates", () => {
    
    const payment: Payment = new Payment("EFEFefefEFEFefefEFEFefef")
    
    const affiliate: Affiliate = new Affiliate(
        new Identification("watson.jack.p@gmail.com", "EFEFefefEFEFefefEFEFefef"), 
        new Charity("EFEFefefEFEFefefEFEFefef")
    );

    payment.addAffiliate(affiliate);
    
    expect(payment.getAffiliates()).toEqual([ affiliate ]);
    
});

test("you can only add two affiliates to a payment", () => {
    
    const payment: Payment = new Payment("EFEFefefEFEFefefEFEFefef")
    payment.execute(new PayPalAdaptor, "123456");
    
    const affiliate: Affiliate = new Affiliate(
        new Identification("watson.jack.p@gmail.com", "EFEFefefEFEFefefEFEFefef"), 
        new Charity("EFEFefefEFEFefefEFEFefef")
    );    
    
    payment.addAffiliate(affiliate);
    payment.addAffiliate(affiliate);
    
    expect(() => payment.addAffiliate(affiliate)).toThrow("You can only add two affiliates.");
});

test("we can can cancel a payment", () => {
    const payment: Payment = new Payment("EFEFefefEFEFefefEFEFefef")
    payment.cancel();
    
    expect(payment.getCanceled()).toBe(true);
})

// Affiliates can be added to a payment so they can get access to the payout.
test("payment is invalid after we execute the payment", async () => {
    
    PayPalAdaptor.prototype.finalize = jest.fn().mockImplementation(async (): Promise<boolean> => {
        throw "Error";
    });

    const payment: Payment = new Payment("EFEFefefEFEFefefEFEFefef")
    const execute: boolean = await payment.execute(new PayPalAdaptor, "123456");

    expect( execute ).toBe(false);
    expect( payment.getError() ).toBe(true);
});

// Affiliates can be added to a payment so they can get access to the payout.
test("payment is successful after we execute the payment", async () => {

    PayPalAdaptor.prototype.finalize = jest.fn().mockImplementation(async (): Promise<boolean> => {
        return true;
    });    

    const payment: Payment = new Payment("EFEFefefEFEFefefEFEFefef")
    const execute: boolean = await payment.execute(new PayPalAdaptor, "123456");

    expect( execute ).toBe(true);
    expect( payment.getSuccess() ).toBe(true);

});

test("you can only request payout if payment is successful", () => {

    const payment: Payment = new Payment("EFEFefefEFEFefefEFEFefef");
    
    expect(() => payment.payout()).toThrow("You can not payout affiliates if the payment was unsuccessful");
});

// Test we can generate a list of payouts which will have the same amount as the affilaites.
test("list of requested payouts equal the amount of affiliates", async () => {
    
    // === Setup ===
    PayPalAdaptor.prototype.finalize = jest.fn().mockImplementation(async (): Promise<boolean> => {
        return true;
    });    

    const payment: Payment = new Payment("EFEFefefEFEFefefEFEFefef")
    await payment.execute(new PayPalAdaptor, "123456");
    
    const identity: Identification  = new Identification("watson.jack.p@gmail.com", "EFEFefefEFEFefefEFEFefef");
    const charity: Charity          = new Charity("EFEFefefEFEFefefEFEFefef");
    const affiliate: Affiliate      = new Affiliate(identity, charity);
    payment.addAffiliate(affiliate);
    
    // === Execute ===
    payment.payout();

    // === Assert ===
    expect(payment.getPayouts().length).toBe(1);
    
});

test("payouts to charities and affiliates are as expected from the payment plan", async () => {

    // === Setup ===
    PayPalAdaptor.prototype.finalize = jest.fn().mockImplementation(async (): Promise<boolean> => {
        return true;
    });    

    const payment: Payment = new Payment("EFEFefefEFEFefefEFEFefef")
    await payment.execute(new PayPalAdaptor, "123456");
    
    const identity: Identification  = new Identification("watson.jack.p@gmail.com", "EFEFefefEFEFefefEFEFefef");
    const charity: Charity          = new Charity("EFEFefefEFEFefefEFEFefef");

    const affiliateOne: Affiliate      = new Affiliate(identity, charity);
    const affiliateTwo: Affiliate      = new Affiliate(identity, charity);
    
    affiliateOne.linkAffiliate(affiliateTwo);
    
    payment.addAffiliate(affiliateOne);

    // === Execute ===
    payment.payout();
    
    // === Assert ===
    expect(payment.getPayouts()[0].getReward().getAmount()).toBe(25);
    expect(payment.getPayouts()[1].getReward().getAmount()).toBe(7.50);

    expect(payment.getPayouts()[0].getDonation().getAmount()).toBe(1);
    expect(payment.getPayouts()[1].getDonation().getAmount()).toBe(1);
    
});

test("nothing happens when you try to payout when there are no affilaites", async () => {
    // === Setup ===
    PayPalAdaptor.prototype.finalize = jest.fn().mockImplementation(async (): Promise<boolean> => {
        return true;
    });    
    
    const payPal: PayPalAdaptor = new PayPalAdaptor();
    const payment: Payment = new Payment("EFEFefefEFEFefefEFEFefef")
    await payment.execute(new PayPalAdaptor, "123456");

    // === Execute ===
    const payoutResponse: boolean = await payment.sendPayouts(payPal);

    // === Assert ===
    expect(payoutResponse).toBe(false);
});


test("can notify recipients of payouts with success", async () => {

    // === Setup ===
    PayPalAdaptor.prototype.finalize = jest.fn().mockImplementation(async (): Promise<boolean> => {
        return true;
    });    
    PayPalAdaptor.prototype.payout = jest.fn().mockImplementation(async (): Promise<string> => {
        return "Irrelevant";
    });    

    const payPal: PayPalAdaptor = new PayPalAdaptor();
    const payment: Payment = new Payment("EFEFefefEFEFefefEFEFefef")
    await payment.execute(payPal, "123456");
    
    const identity: Identification  = new Identification("watson.jack.p@gmail.com", "EFEFefefEFEFefefEFEFefef");
    const charity: Charity          = new Charity("EFEFefefEFEFefefEFEFefef");

    const affiliateOne: Affiliate      = new Affiliate(identity, charity);
    const affiliateTwo: Affiliate      = new Affiliate(identity, charity);
    
    affiliateOne.linkAffiliate(affiliateTwo);
    
    payment.addAffiliate(affiliateOne);
    payment.payout();

    // === Execute ===
    await payment.sendPayouts(payPal);

    // === Assert ===
    expect(payment.getPayouts()[0].getSuccess()).toBe(true);
    expect(payment.getPayouts()[1].getSuccess()).toBe(true);

    expect(payment.getPayouts()[0].getBatchId()).toBe("Irrelevant");
    expect(payment.getPayouts()[1].getBatchId()).toBe("Irrelevant");
});

test("still send payout to some if succesful", async () => {
    // === Setup ===
    PayPalAdaptor.prototype.finalize = jest.fn().mockImplementation(async (): Promise<boolean> => {
        return false;
    });    
    PayPalAdaptor.prototype.payout = jest.fn().mockImplementation(async (): Promise<string> => {
        throw "Irrelevant";
    });    

    const payPal: PayPalAdaptor = new PayPalAdaptor();
    const payment: Payment = new Payment("EFEFefefEFEFefefEFEFefef")
    await payment.execute(payPal, "123456");
    
    const identity: Identification  = new Identification("watson.jack.p@gmail.com", "EFEFefefEFEFefefEFEFefef");
    const charity: Charity          = new Charity("EFEFefefEFEFefefEFEFefef");

    const affiliateOne: Affiliate      = new Affiliate(identity, charity);
    const affiliateTwo: Affiliate      = new Affiliate(identity, charity);
    
    affiliateOne.linkAffiliate(affiliateTwo);
    
    payment.addAffiliate(affiliateOne);
    payment.payout();

    // === Execute ===
    await payment.sendPayouts(payPal);

    // === Assert (Notice GetError) ===
    expect(payment.getPayouts()[0].getError()).toBe(true);
    expect(payment.getPayouts()[1].getError()).toBe(true);
});
