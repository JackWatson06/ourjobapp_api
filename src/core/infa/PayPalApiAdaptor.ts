
import PaymentProcessingAdaptor from "./PaymentProcessingAdaptor";

export default class PayPalApiAdaptor implements PaymentProcessingAdaptor
{
    public makePayment(): string
    {
        return "Hello!";   
    }


    public sendPayout(): boolean
    {
        return true;
    }
}
