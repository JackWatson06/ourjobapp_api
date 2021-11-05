
import {PaymentAdaptor, PaymentCreateResponse} from "./PaymentAdaptor";

export default class PayPalAdaptor implements PaymentAdaptor
{
    /**
     * Execute a payment using the paypayl API. We will also need a execute payment once we get paypals proper terminology.
     */
    public async create(amount: number): Promise<PaymentCreateResponse>
    {
        return {
            id: "helo",
            redirect: "Hi"
        };   
    }

    public async finalize(): Promise<boolean>
    {
        return true;
    }

    public async payout(amount: number, email: string): Promise<boolean>
    {
        return true;
    }
}
