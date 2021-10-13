import { ObjectId } from "mongodb";

// ===============
// |   Models    |
// ===============

// Major Model
export type Major = {
    _id?: ObjectId,
    name: string,
    created_at: number
}

// Job Model
export type Job = {
    _id?: ObjectId,
    name: string,
    job_group: string,
    created_at: number
}

// Job Group Model
export type JobGroup = {
    _id?: ObjectId,
    name: string,
    created_at: number
}

// Charity Model
export type Charity = {
    _id?: ObjectId,
    name: string,
    hash: string,
    created_at: number
}

// Affiliate Model
export type Affiliate = {
    _id?: ObjectId,
    affiliate_id?: ObjectId,
    updated_at?: string,

    name: string,
    charity: string,
    email: string,
    verified: boolean
    created_at: number
}