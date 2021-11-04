/**
 * Original Author: Jack Watson
 * Created Date: 11/4/2021
 * Purpose: A payment process represents the infastructure that is required in order to allow our system to make payments
 * using some sort of external API system or potentially our own system in the future.
 */

export default interface PaymentProcessingAdaptor
{
    // Return the redirect
    makePayment(): string;

    // Return the redirect
    sendPayout(): boolean;
}

