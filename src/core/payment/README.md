# Payment Service
The OurJob.App application closes the loop on hiring. Employers can pay to view candidate contact
information when they find a good match. The _Payment Service_ allows our application to handle
payments. We need to both receive payments from employers and create payouts for affiliates.

## PayPal
We use _PayPal_ to handle payments. Specifically, we use the _paypal-rest-sdk_ to interact with the
_PayPal_ API in our code. Follow the below documentation to get started. To test payments locally
you will need developer credentials from _PayPal_. Additionally, we configure the _paypal-rest-sdk_
in the _./src/core/bootstrap/dependencies.ts_ file.
- [PayPal Development Center](https://developer.paypal.com/home/)
- [PayPal Rest SDK](https://www.npmjs.com/package/paypal-rest-sdk)

### Environment Settings
- **DOMAIN**: The domain that we redirect after requesting to make a payment.
- **PAYPAL_MODE**: The mode we set the _PayPal SDK_ to.
- **PAYPAL_CLIENT_ID**: Client ID used by the _PayPal SDK_.
- **PAYPAL_SECRET**: Secret used by the _PayPal SDK_.



