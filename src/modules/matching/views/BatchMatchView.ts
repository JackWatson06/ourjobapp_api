/**
 * Original Author: Jack Watson
 * Created Date: 11/3/2021
 * Purpose: This class takes a batch match and will return the view that we will show during the email.
 */

import BatchMatch from "../entities/BatchMatch"

export type BatchMatchView = {
    name: string,
    matches: [{
        name: string,
        job: string,
        rate: string,
        location: string,
        email: string,
        phone: string,
        authorized: string,
        remote: string,
        commitment: string,
        resume: string,
        paymentLink: string
    }]
}

/**
 * Transform the affiliate into the something that the front-end will care about.
 * @param affiliate Affiliate we want to transform.
 */
export function transform(batchMatch: BatchMatch): BatchMatchView|null
{

    console.log(batchMatch);
    
    return null;
}
