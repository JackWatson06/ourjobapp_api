import { JSONSchemaType } from "ajv";

export interface NewEmployee {
    nations       ?: number[],
    place_id      ?: string,
    major         ?: string[],
    affiliate_id  ?: string

    fname         : string
    lname         : string
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
            type: "integer" 
        }, // <= Enumeration
        where:       { 
            type: "integer" 
        }, // <= Enumeration
        authorized:  { 
            type  : "array",
            items : {
                type: "integer"
            }
        },
        distance:    { 
            type: "integer" 
        },  // <= This would be enumeration of distances
        nations:     {
            type : "array",
            items: {
                type: "integer"
            },
            nullable: true
        },
        place_id:     { 
            type: "string", 
            nullable: true 
        }, // <= This would be the place id.
        education:    { 
            type: "integer" 
        },
        major:        {
            type: "array",
            items: {
                type: "string"
            }, 
            nullable: true
        },
        experience:   { 
            type: "integer" 
        }, // <= Enumeration
        information:  { 
            type: "string" 
        },
        email:        { 
            type: "string" 
        },
        phone:        { 
            type: "string" 
        },
        affiliate_id: {
            type: "string"
        }
    },
    required: [ "fname", "lname", "job_id", "hourly_rate", "commitment", "where", "authorized", "distance", "education",
        "experience", "information", "email", "phone" ],
    additionalProperties: false
}