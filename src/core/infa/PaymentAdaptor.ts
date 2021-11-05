/**
 * Original Author: Jack Watson
 * Created Date: 11/4/2021
 * Purpose: A payment process represents the infastructure that is required in order to allow our system to make payments
 * using some sort of external API system or potentially our own system in the future.
 */
export type PaymentCreateResponse = {
    id: string,
    redirect: string
}

export interface PaymentAdaptor
{
    // Return the redirect
    create(amount: number): Promise<PaymentCreateResponse>;

    // Finfalize the payment.
    finalize(): Promise<boolean>;

    // Return the redirect
    payout(amount:number, email: string): Promise<boolean>;
}