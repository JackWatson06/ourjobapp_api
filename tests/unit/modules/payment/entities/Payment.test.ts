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

/**
 * Error mock and non-error mock.
 * 
 * 
 * 
 */


// Affiliates can be added to a payment so they can get access to the payout.
test("can add affiliates", () => {
    /**
     * const payment: Payment = new Payment("EFEFefefEFEFefefEFEFefef")
     * 
     * const affiliate: Affilaite = new Affiliate("EFEFefefEFEFefefEFEFefef", "EFEFefefEFEFefefEFEFefef", 1);
     * payment.addAffiliate(affiliate);
     * 
     * expect(payment.getAffiliates()).toBe([ affiliate ]);
     */
});

// Affiliates can be added to a payment so they can get access to the payout.
test("execute fails when payment fails.", () => {
    /**
     * const payment: Payment = new Payment("EFEFefefEFEFefefEFEFefef")
     * 
     * expect(payment.execute(PayPalApiError)).toBe(false);
     * expect(payment.getError()).toBe(true);
     */
});

// Affiliates can be added to a payment so they can get access to the payout.
test("execute succeeds when payment succeeds.", () => {
    /**
     * const payment: Payment = new Payment("EFEFefefEFEFefefEFEFefef")
     * 
     * expect(payment.execute(PayPalApiSuccess)).toBe(true);
     * expect(payment.getSuccess()).toBe(true);
     */
});

test("you can only add two affiliates to a payment", () => {
    /**
     * const payment: Payment = new Payment("EFEFefefEFEFefefEFEFefef")
     * payment.execute(PayPalApiSuccess);
     * 
     * const affiliate: Affilaite = new Affiliate("EFEFefefEFEFefefEFEFefef", "EFEFefefEFEFefefEFEFefef", 1);
     * payment.addAffiliate(affiliate);
     * payment.addAffiliate(affiliate);
     * 
     * expect(payment.addAffiliate(affiliate)).toThrow(Error);
     */
});

test("you can only request payout if payment is successful", () => {
    /**
     * const payment: Payment = new Payment("EFEFefefEFEFefefEFEFefef");
     * 
     * expect(payment.payouts).toThrow(Error);
     */
});

// Test we can generate a list of payouts which will have the same amount as the affilaites.
test("list of requested payouts equal the amount of affiliates", () => {
    /**
     * const payment: Payment = new Payment("EFEFefefEFEFefefEFEFefef")
     * payment.execute(PayPalApiSuccess);
     * 
     * const affiliate: Affilaite = new Affiliate("EFEFefefEFEFefefEFEFefef", "EFEFefefEFEFefefEFEFefef", 1);
     * payment.addAffiliate(affiliate);
     * 
     * payment.payout();
     * expect(payment.getRequestedPayouts().length).toBe(1);
     */
});

test("affiliate payments are as expected from the payment plan", () => {
    /**
     * const payment: Payment         = new Payment("EFEFefefEFEFefefEFEFefef")
     * const paymentPlan: PaymentPlan = payment.getPaymentPlan();
     * payment.execute(PayPalApiSuccess);
     * 
     * // Affilaites need to check to make sure that you can only nest one. If the affiliates aready have an affiliate don't nest. This allows
     * // us to store the business rule that affiliates only get paid which are double down the chain.
     * const affiliateOneNested: Affiliate = new Affiliate("EFEFefefEFEFefefEFEFefef", "EFEFefefEFEFefefEFEFefef");
     * const affiliateOne: Affiliate   = new Affiliate("EFEFefefEFEFefefEFEFefef", "EFEFefefEFEFefefEFEFefef", affiliateOneNested);
     * 
     * payment.addAffiliate(affiliateOne);
     * 
     * payment.payout();
     * const payout: Array<RequestedPayout> = payment.getRequestedPayouts();
     * 
     * expect(payout[0].getAffiliateAmount()).toBe(15.97);
     * expect(payout[1].getAffiliateAmount()).toBe(6.97);
     */
});

test("donation payments are as expected from the payment plan", () => {
    /**
     * const payment: Payment         = new Payment("EFEFefefEFEFefefEFEFefef")
     * const paymentPlan: PaymentPlan = payment.getPaymentPlan();
     * payment.execute(PayPalApiSuccess);
     * 
     * // Affilaites need to check to make sure that you can only nest one. If the affiliates aready have an affiliate don't nest. This allows
     * // us to store the business rule that affiliates only get paid which are double down the chain.
     * const affiliateOneNested: Affiliate = new Affiliate("EFEFefefEFEFefefEFEFefef", "EFEFefefEFEFefefEFEFefef");
     * const affiliateOne: Affiliate       = new Affiliate("EFEFefefEFEFefefEFEFefef", "EFEFefefEFEFefefEFEFefef", affiliateOneNested);
     * 
     * payment.addAffiliate(affiliateOne);
     * 
     * payment.payout();
     * const payout: Array<Payout> = payment.getPayouts();
     * 
     * expect(payout[0].getDonationPayout()).toBe(1.00);
     * expect(payout[1].getDonationPayout()).toBe(0.67);
     */
});

test("can notify recipients of payouts with success", () => {
    /**
     * const payment: Payment = new Payment("EFEFefefEFEFefefEFEFefef")
     * payment.execute(PayPalApiSuccess);
     * 
     * // Affilaites need to check to make sure that you can only nest one. If the affiliates aready have an affiliate don't nest. This allows
     * // us to store the business rule that affiliates only get paid which are double down the chain.
     * const affiliateOneNested: Affiliate = new Affiliate("EFEFefefEFEFefefEFEFefef", "EFEFefefEFEFefefEFEFefef");
     * const affiliateOne: Affiliate       = new Affiliate("EFEFefefEFEFefefEFEFefef", "EFEFefefEFEFefefEFEFefef", affiliateOneNested);
     * 
     * payment.payout();
     * payment.notifyPayouts(PayPalApiSuccess);
     * expect(payment.getPayouts()[1].getSuccess()).toBe(true);
     * expect(payment.getPayouts()[2].getSuccess()).toBe(true);
     */
});

test("still send payout to some if succesful", () => {
    /**
     * const payment: Payment = new Payment("EFEFefefEFEFefefEFEFefef")
     * payment.execute(PayPalApiSuccess);
     * 
     * // Affilaites need to check to make sure that you can only nest one. If the affiliates aready have an affiliate don't nest. This allows
     * // us to store the business rule that affiliates only get paid which are double down the chain.
     * const affiliateOneNested: Affiliate = new Affiliate("EFEFefefEFEFefefEFEFefef", "EFEFefefEFEFefefEFEFefef");
     * const affiliateOne: Affiliate       = new Affiliate("EFEFefefEFEFefefEFEFefef", "EFEFefefEFEFefefEFEFefef", affiliateOneNested);
     * 
     * payment.payout();
     * 
     * payment.notifyPayouts(PayPalApiError);
     * expect(payment.getPayouts()[1].getSuccess()).toBe(true);
     * expect(payment.getPayouts()[2].getError()).toBe(false);
     */
});
