import PaymentRequest from "modules/payment/entities/PaymentRequest";

import { PaymentCreateResponse } from "src/core/payment/PaymentI";
import PayPalAdaptor from "src/core/payment/PayPalAdaptor";

jest.mock("infa/PayPalAdaptor");

test("can hire employee", () => {

    const paymentRequest: PaymentRequest = new PaymentRequest("EFEFefefEFEFefefEFEFefef", "EFEFefefEFEFefefEFEFefef"); 
    
    expect(paymentRequest.getEmployeeId()).toEqual("EFEFefefEFEFefefEFEFefef");
});


test("payment equal payment plans amount", () => {

    const paymentRequest: PaymentRequest = new PaymentRequest("EFEFefefEFEFefefEFEFefef", "EFEFefefEFEFefefEFEFefef"); 
    
    expect(paymentRequest.getAmount()).toEqual(100);
});

    
// This is where we get into the paypal API. Instead of depending on paypal api we should depend on a PaymentProcessingInterface.... dependency inversion my friends.
test("is successful", async () => {

    PayPalAdaptor.prototype.create = jest.fn().mockImplementation(async (): Promise<PaymentCreateResponse> => {
        return await { id: "IRRELIVANT", redirect: "https://localhost:8080" }
    });

    const paymentRequest: PaymentRequest = new PaymentRequest("EFEFefefEFEFefefEFEFefef", "EFEFefefEFEFefefEFEFefef"); 
    
    expect( await paymentRequest.processPayment(new PayPalAdaptor)).toBe(true);
    expect( paymentRequest.getPaymentId()).toBe("IRRELIVANT");
    expect( paymentRequest.getRedirect()).toBe("https://localhost:8080"); 
});


// This is where we get into the paypal API. Instead of depending on paypal api we should depend on a PaymentProcessingInterface.... dependency inversion my friends.
test("throws an error", async () => {

    PayPalAdaptor.prototype.create = jest.fn().mockImplementation(async (): Promise<PaymentCreateResponse> => {
        throw "Testing";
    });
    
    const paymentRequest: PaymentRequest = new PaymentRequest("EFEFefefEFEFefefEFEFefef", "EFEFefefEFEFefefEFEFefef"); 
    
    expect( await paymentRequest.processPayment(new PayPalAdaptor) ).toBe(false);
});

