import { JSONSchemaType } from "ajv";
import * as Constants from "infa/Constants";

export interface NewEmployer {
    website      ?: string,
    affiliate_id ?: string,

    fname        : string
    lname        : string
    position     : string,
    company_name : string,
    place_id     : string,
    address      : string,
    industry     : string[],
    experience   : number[],
    salary       : number,
    commitment   : number,
    where        : number,
    authorized   : boolean,
    email        : string
  }
  
export const schema: JSONSchemaType<NewEmployer> = {

    type: "object",
    properties: {
        fname       : { 
            type: "string" 
        },
        lname       : { 
            type: "string" 
        },
        position    : { 
            type: "string" 
        },
        company_name: { 
            type: "string" 
        },
        website     : { 
            type: "string", 
            nullable: true 
        },
        place_id    : { 
            type: "string" 
        },
        industry    : { 
            type : "array",
            items: {
                type: "string"
            },
        }, 
        experience  : {
            type : "array",
            items: {
                type: "integer",
                enum: Object.values(Constants.Experience)
            },
        },
        salary       : { 
            type: "integer"
        },             // <= Enumeration
        commitment   : { 
            type: "integer",
            enum: Object.values(Constants.Commitment)
        },   // <= Enumeration
        where        : { 
            type: "integer",
            enum: Object.values(Constants.Where)
        },   // <= Enumeration
        authorized: { 
            type: "boolean" 
        },
        email        : { 
            type: "string" 
        },
        affiliate_id : { 
            type: "string",
            nullable: true 
        }
    },
    required: ["fname", "lname", "position", "company_name", "place_id", "industry", "experience", "salary", "commitment",
        "where", "authorized", "email"
    ],
    additionalProperties: false
}