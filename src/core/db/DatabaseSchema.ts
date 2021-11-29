import { ObjectId } from "mongodb";
import { Constants } from "./Constants";

export namespace Schema {

    /**
     * === Constants ====
     */
    export type Major = {
        _id?: ObjectId,
        name: string,
        created_at: number
    }

    export type Country = {
        _id          ?: ObjectId,
        country_code  : string,
        name          : string,
        created_at    : number
    }

    export type Job = {
        _id?       : ObjectId,
        name       : string,
        job_group  : string,
        created_at : number
    }

    export type JobGroup = {
        _id?       : ObjectId,
        name       : string,
        created_at : number
    }

    export type Charity = {
        _id?       : ObjectId,
        name       : string,
        hash       : string,
        created_at : number
    }


    /**
     * === Matching ====
     */
    export type Batch = {
        _id        : ObjectId,
        created_at : number
    }

    export type BatchMatch = {
        _id        ?: ObjectId,
        batch_id   ?: ObjectId,
        employer_id : ObjectId,
        created_at  : number
    }

    export type Match = {
        _id            ?: ObjectId,
        batch_match_id  : ObjectId,
        employee_id     : ObjectId,
        job_id          : ObjectId,
        score           : number
    }

    export type Email = {
        _id            ?: ObjectId,
        sent_at        ?: number,
        
        batch_match_id : ObjectId,
        message_token  : string,
        email          : string,
        sent           : boolean,
        error          : boolean,
        created_at     : number
    }

    export type Location = {
        _id         ?: ObjectId,
        place_id     : string,
        address      : string,
        country_code : string,
        latitutde    : number,
        longitude    : number,
        created_at   : number
    }

    /**
     * === Payment ===
     */

    export type Payment = {
        _id         ?: ObjectId,
        executed_at ?: number, // When the payment actual was finalized.
        canceled_at ?: number, // When the payment was canceled.
        employer_id  : ObjectId,
        employee_id  : ObjectId,
        paypal_id    : string, // Information amount the actual payment.
        currency     : string,
        amount       : number,
        success      : boolean, // State the payment is in.
        error        : boolean, // State the payment is in.
        started_at   : number, // Time the payment was started from the paypal redirect
    }

    export type Payout = {
        _id             ?: ObjectId,
        sent_at         ?: number

        affiliate_id     : ObjectId,
        payment_id       : ObjectId,
        charity_id       : ObjectId,
        batch_id         : string, // <= From paypal
        amount           : number,
        donation         : number,
        currency         : string,
        success          : boolean,
        error            : boolean,
    }

    // === Users ===
    export type Affiliate = {
        _id          ?: ObjectId,
        affiliate_id ?: ObjectId,

        signup_id     : ObjectId,
        charity_id    : ObjectId,
        name          : string,
        phone         : string,
        created_at    : number
    }

    export type Employee = {
        _id          ?: ObjectId, 
        affiliate_id ?: ObjectId,
        major        ?: ObjectId[],
        nations      ?: ObjectId[],
        place_id     ?: string,
        information  ?: string,

        signup_id     : ObjectId,
        job_id        : ObjectId[],
        authorized    : ObjectId[],
        fname         : string,
        lname         : string,
        hourly_rate   : number,
        commitment    : Constants.Commitment,
        where         : Constants.Where,
        distance      : Constants.Distance,
        education     : Constants.Education,
        experience    : Constants.Experience,
        email         : string,
        phone         : string,
        created_at    : number
    }

    export type Employer = {
        _id          ?: ObjectId,
        affiliate_id ?: ObjectId,
        website      ?: string,
        
        signup_id    : ObjectId,
        industry     : ObjectId[],
        fname        : string,
        lname        : string,
        position     : string,
        company_name : string,
        place_id     : string,   // <= Select multiple of the job group
        experience   : Constants.Experience[],   // <= Experience level is select multiple
        salary       : number,
        commitment   : Constants.Commitment,
        where        : Constants.Where,
        authorized   : boolean,
        email        : string,
        created_at   : number
    }

    /**
     * === Signup ====
     */
    export type Document = {
        _id        ?: ObjectId,
        type        : Constants.Document,
        resource    : Constants.Resource,
        resource_id : ObjectId,
        name        : string,
        path        : string,
        extension   : string,
        size        : number
    }

    export type Signup = {
        _id        ?: ObjectId,
        type        : Constants.Resource,
        data        : {},
    }

    export type Token = {
        _id         ?: ObjectId,
        code        ?: number,
        signup_id    : ObjectId
        secret       : string,
        verified     : boolean,
        verified_at  : number,
        expired_at   : number,
        created_at   : number
    }
}
