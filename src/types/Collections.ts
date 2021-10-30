import { ObjectId } from "mongodb";

// ===============
// |   Models    |
// ===============

export type Major = {
    _id?: ObjectId,
    name: string,
    created_at: number
}

export type Country = {
    _id?: ObjectId,
    name: string,
    created_at: number
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
    token_id      : ObjectId,
 
    affiliate_id ?: ObjectId,
    major        ?: string[],
    nations      ?: number[],
    place_id     ?: string,
    verified_on  ?: number,

    fname         : string,
    lname         : string,
    job_id        : string[],
    hourly_rate   : number,
    commitment    : number,
    where         : number,
    authorized    : number[],
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
    token_id      : ObjectId,

    affiliate_id ?: ObjectId,
    verified_on  ?: number,
    website      ?: string,

    fname        : string
    lname        : string
    position     : string,
    company_name : string,
    place_id     : string,
    industry     : string[],   // <= Select multiple of the job group
    experience   : number[],   // <= Experience level is select multiple
    salary       : number,
    commitment   : number,
    where        : number,
    international: boolean,
    authorized   : boolean,
    email        : string,
    verified     : boolean
}