/**
 * Original Author: Jack Watson
 * Created Date: 11/4/2021
 * Purpose: This represents a payment request that the employer initializes when they want to puchase an employee.
 */

import { PaymentI, PaymentCreateResponse} from "payment/PaymentI";
import PaymentPlan from "./PaymentPlan";

export default class PaymentRequest
{   
    private employerId: string;
    private employeeId: string;
    private paymentId: string;
    private redirect: string;

    constructor(employerId: string, employeeId: string)
    {
        this.employerId = employerId;
        this.employeeId = employeeId;
    }

    /**
     * Process payment on the payment request. Use our current implemenation of the payment adaptor.
     * @param paymentProcessor Payment processing adaptor
     */
    public async processPayment(paymentProcessor: PaymentI): Promise<boolean>
    {
        try
        {
            const payment: PaymentCreateResponse = await paymentProcessor.create(PaymentPlan.AMOUNT);
            this.paymentId = payment.id;
            this.redirect = payment.redirect;

            return true;
        }
        catch(error)
        {
            return false;
        }
    }

    public getEmployerId() : string
    {
        return this.employerId;
    }
    
    public getEmployeeId(): string
    {
        return this.employeeId;
    }

    public getAmount(): number
    {
        return PaymentPlan.AMOUNT;
    }

    public getRedirect(): string
    {
        return this.redirect;
    }

    public getPaymentId(): string
    {
        return this.paymentId;
    }

    public getCurrency() : string
    {
        return PaymentPlan.CURRENCY;
    }
}
