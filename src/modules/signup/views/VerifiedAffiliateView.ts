/**
 * Original Author: Jack Watson
 * Created Date: 10/25/2021
 * Purpose: This class takes in a affiliate then transforms it into a link which will be displayed on the front-end
 */


import Affiliate from "../entities/Affiliate";

export type VerifiedAffiliateView = {
    link: string,
}

/**
 * Transform the affiliate into the something that the front-end will care about.
 * @param affiliate Affiliate we want to transform.
 */
export default function transform(affiliate: Affiliate): VerifiedAffiliateView
{
    return {
        link: `ourjob.app/${ affiliate.getName() }`
    }
}
