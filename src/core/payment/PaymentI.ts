/**
 * A payment process represents the infastructure that is required in order to allow our system to make payments
 * using some sort of external API system or potentially our own system in the future. We might be able to just type this
 * library out in the .d.ts. That way we have better import syntax for the actual interface, and types.
 */
export type PaymentCreateResponse = {
    id: string,
    redirect: string
}

export type PayoutCreateRequest = {
    amount: number,
    phone: string
}

export interface PaymentI
{
    // Return the redirect
    create(amount: number): Promise<PaymentCreateResponse>;

    // Finfalize the payment.
    finalize(paymentId: string, payerId: string): Promise<boolean>;

    // Return the redirect
    payout(payouts: Array<PayoutCreateRequest>): Promise<string>;
}