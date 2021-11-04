

test("affiliates can only have a chain of TWO affiliates", () => {
    /**
     * // Affilaites need to check to make sure that you can only nest one. If the affiliates aready have an affiliate don't nest. This allows
     * // us to store the business rule that affiliates only get paid which are double down the chain.
     * const affiliateDoubleNested: Affiliate = new Affiliate("EFEFefefEFEFefefEFEFefef", "EFEFefefEFEFefefEFEFefef");
     * const affiliateOneNested: Affiliate = new Affiliate("EFEFefefEFEFefefEFEFefef", "EFEFefefEFEFefefEFEFefef", affiliateDoubleNested);
     *
     * expect(new Affiliate("EFEFefefEFEFefefEFEFefef", "EFEFefefEFEFefefEFEFefef", affiliateOneNested)).toThrow(Error);
     */
});


test("single affiliate generates a payout", () => {
    /**
     * // Affilaites need to check to make sure that you can only nest one. If the affiliates aready have an affiliate don't nest. This allows
     * // us to store the business rule that affiliates only get paid which are double down the chain.
     * const affiliateOne: Affiliate = new Affiliate("EFEFefefEFEFefefEFEFefef", "EFEFefefEFEFefefEFEFefef");
     * const paymentPlan: PaymentPlan = new PaymentPlan();
     * 
     * expect(affiliateOne.pay(PaymentPLan).length).toBe(1);
     */
});

test("nested affiliates generate two payouts", () => {
    /**
     * // Affilaites need to check to make sure that you can only nest one. If the affiliates aready have an affiliate don't nest. This allows
     * // us to store the business rule that affiliates only get paid which are double down the chain.
     * const affiliateOne: Affiliate = new Affiliate("EFEFefefEFEFefefEFEFefef", "EFEFefefEFEFefefEFEFefef");
     * const paymentPlan: PaymentPlan = new PaymentPlan();
     * 
     * expect(affiliateOne.pay(PaymentPLan).length).toBe(2);
     */
});

