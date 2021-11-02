import { ObjectId } from "mongodb";

// ===============
// |   Models    |
// ===============



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
    _id       ?: ObjectId,
    created_at : number
}

export type Match = {
    _id        ?: ObjectId,
    batch_id   ?: ObjectId,
    employer_id : ObjectId,
    matches     : ObjectId[],
    scores      : number[],
    created_at  : number
}

export type Email = {
    _id       ?: ObjectId,
    match_id   : ObjectId,
    created_at : number
}

export type Location = {
    _id         ?: ObjectId,
    place_id     : string,
    country_code : string,
    latitutde    : number,
    longitude    : number,
    created_at   : number
}

/**
 * === Signup ====
 */
export type Contract = {
    _id       ?: ObjectId,

    hash       : string,
    created_at : number
}

export type Token = {
    _id         ?: ObjectId,

    token       : string,
    expired_at  : number,
    created_at  : number
}

export type Affiliate = {
    _id          ?: ObjectId,
    affiliate_id ?: ObjectId,
    verified_on  ?: number,

    token_id      : ObjectId,
    name          : string,
    charity_id    : string,
    email         : string,
    verified      : boolean
    created_at    : number
}

export type Employee = {
    _id          ?: ObjectId,
    contract_id  ?: ObjectId,
    token_id      : ObjectId,
 
    affiliate_id ?: ObjectId,
    major        ?: ObjectId[],
    nations      ?: ObjectId[],
    place_id     ?: string,
    verified_on  ?: number,

    job_id        : ObjectId[],
    authorized    : ObjectId[],
    fname         : string,
    lname         : string,
    hourly_rate   : number,
    commitment    : number,
    where         : number,
    distance      : number,
  
    education     : number,
    experience    : number,
    information   : string,
    email         : string,
    phone         : string
    verified      : boolean
}

export type Employer = {
    _id          ?: ObjectId,
    contract_id  ?: ObjectId,
    token_id      : ObjectId,

    affiliate_id ?: ObjectId,
    verified_on  ?: number,
    website      ?: string,

    industry     : ObjectId[],
    fname        : string
    lname        : string
    position     : string,
    company_name : string,
    place_id     : string,   // <= Select multiple of the job group
    experience   : number[],   // <= Experience level is select multiple
    salary       : number,
    commitment   : number,
    where        : number,
    authorized   : boolean,
    verified     : boolean,
    email        : string,
}