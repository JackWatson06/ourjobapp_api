import { JSONSchemaType } from "ajv";
import { Constants } from "db/Constants";

export interface NewEmployee {
    nations       ?: string[]
    place_id      ?: string
    major         ?: string[]
    information   ?: string
    affiliate_id  ?: string
    resume_id     ?: string

    fname         : string
    lname         : string
    job_id        : string[]
    authorized    : string[]
    hourly_rate   : number
    commitment    : number
    where         : number
    distance      : number
    education     : number
    experience    : number
    email         : string
    phone         : string
  }
  
export const schema: JSONSchemaType<NewEmployee> = {

    type: "object",
    properties: {
        fname:       { 
            type: "string" 
        },
        lname:       { 
            type: "string"
        },
        job_id:      { 
            type: "array",
            items: {
                type: "string"
            }
        },
        hourly_rate: { 
            type: "integer" 
        }, // <= Enumeration
        commitment:  { 
            type: "integer",
            enum: Constants.values(Constants.Commitment)
        }, // <= Enumeration
        where:       { 
            type: "integer",
            enum: Constants.values(Constants.Where)
        }, // <= Enumeration
        authorized:  { 
            type  : "array",
            items : {
                type: "string"
            }
        },
        distance:    { 
            type: "integer" 
        },  // <= This would be enumeration of distances
        nations:     {
            type : "array",
            items: {
                type: "string"
            },
            nullable: true
        },
        place_id:     { 
            type: "string", 
            nullable: true 
        }, // <= This would be the place id.
        education:    { 
            type: "integer",
            enum: Constants.values(Constants.Education) 
        },
        major:        {
            type: "array",
            items: {
                type: "string"
            }, 
            nullable: true
        },
        experience:   { 
            type: "integer",
            enum: Constants.values(Constants.Experience)
        }, // <= Enumeration
        information:  { 
            type: "string",
            nullable: true
        },
        email:        { 
            type: "string" 
        },
        phone:        { 
            type: "string" 
        },
        affiliate_id: {
            type: "string",
            nullable: true 
        },
        resume_id: {
            type: "string",
            nullable: true 
        }
    },
    required: [ "fname", "lname", "job_id", "hourly_rate", "commitment", "where", "authorized", "distance", "education",
        "experience", "email", "phone" ],
    additionalProperties: false
}