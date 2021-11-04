
// import PayPalApiAdaptor from "infa/PayPalApiAdaptor";

// jest.mock("infa/PayPalApiAdaptor");

// const MockPaymentProcessing = PayPalApiAdaptor as jest.Mock<typeof PayPalApiAdaptor> 


test("can hire employee", () => {
    /**
     * const paymentRequest: PaymentRequest = new PaymentRequest("EFEFefefEFEFefefEFEFefef", "EFEFefefEFEFefefEFEFefef"); 
     * 
     * expect(payment.getEmployeeId()).toEqual("EFEFefefEFEFefefEFEFefef");
     */
});


test("payment equal payment plans amount", () => {
    /**
     * const paymentRequest: PaymentRequest = new PaymentRequest("EFEFefefEFEFefefEFEFefef", "EFEFefefEFEFefefEFEFefef"); 
     * const paymentPlan: PaymentPlan       = new PaymentPlan(); // Every employer by default has a payment plan
     *
     * expect(paymentRequest.getAmount()).toEqual(paymentPLan.getAmount());
     */
});

// This is where we get into the paypal API. Instead of depending on paypal api we should depend on a PaymentProcessingInterface.... dependency inversion my friends.
test("can process payment", () => {
    /**
     * const paymentRequest: PaymentRequest = new PaymentRequest("EFEFefefEFEFefefEFEFefef", "EFEFefefEFEFefefEFEFefef"); 
     * 
     * expect( paymentRequest.processPayment(PayPalApiSuccess)).toBe(true);
     * 
     * expect( paymentRequest.getUrl()).toBe("https://localhost:8080"); <= Whatever our mock returns.
     * expect( paymentRequest.getId()).toBe("Fatty");                   <= Whatever our mock returns.
     */
});


// This is where we get into the paypal API. Instead of depending on paypal api we should depend on a PaymentProcessingInterface.... dependency inversion my friends.
test("process payment error", () => {
    /**
     * const paymentRequest: PaymentRequest = new PaymentRequest("EFEFefefEFEFefefEFEFefef", "EFEFefefEFEFefefEFEFefef"); 
     * 
     * expect( employer.processPayment(PayPalApiError)).toBe(false);
     */
});

