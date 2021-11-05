
import {PaymentAdaptor, PaymentCreateResponse} from "./PaymentAdaptor";
import paypal from "paypal-rest-sdk";

export default class PayPalAdaptor implements PaymentAdaptor
{
    /**
     * Execute a payment using the paypayl API. We will also need a execute payment once we get paypals proper terminology.
     */
    public async create(amount: number): Promise<PaymentCreateResponse>
    {
        const create_payment_json: paypal.Payment = {
            "intent": "sale",
            "payer": {
                "payment_method": "paypal"
            },
            "redirect_urls": {
                "return_url": `${process.env.DOMAIN}/success`,
                "cancel_url": `${process.env.DOMAIN}/cancel`
            },
            "transactions": [{
                "item_list": {
                    "items": [{
                        "name": "Hire Candidate",
                        "sku": "001",
                        "price": `${amount}`,
                        "currency": "USD",
                        "quantity": 1
                    }]
                },
                "amount": {
                    "currency": "USD",
                    "total": amount
                },
                "description": "Hire your candidate through ourjob.app"
            }]
        };

        return new Promise( (resolve, reject) => {
            paypal.payment.create(create_payment_json, function (error, payment) {
                if (error) {
                    reject(error);
                } else {


                    console.log(payment);
                    

                    // for(let i = 0;i < payment.links.length;i++){
                    //   if(payment.links[i].rel === 'approval_url'){
                    //     res.redirect(payment.links[i].href);
                    //   }
                    // }

                }
              });
        } )
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
