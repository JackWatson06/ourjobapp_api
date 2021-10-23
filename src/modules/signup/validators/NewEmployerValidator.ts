import { JSONSchemaType } from "ajv";

export interface NewEmployer {
    fname        : string
    lname        : string
    position     : string,
    company_name : string,
    website      ?: string,
    place_id     : string,
    industry     : string[],
    experience   : number[],
    salary       : number,
    commitment   : number,
    where        : number,
    international: boolean,
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
                type: "integer"
            },
        },
        salary       : { 
            type: "integer"
        },             // <= Enumeration
        commitment   : { 
            type: "integer" 
        },   // <= Enumeration
        where        : { 
            type: "integer" 
        },   // <= Enumeration
        international: { 
            type: "boolean" 
        },   // <= Enumeration
        authorized   : { 
            type: "boolean" 
        },   // <= Enumeration
        email        : { 
            type: "string" 
        }
    },
    required: ["fname", "lname", "position", "company_name", "place_id", "industry", "experience", "salary", "commitment",
        "where", "international", "authorized", "email"
    ],
    additionalProperties: false
}