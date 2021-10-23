import { JSONSchemaType } from "ajv";

export interface NewAffiliate {
    name       : string
    email      : string
    charity_id : string
  }
  
export const schema: JSONSchemaType<NewAffiliate> = {
    type: "object",
    properties: {
        name: { 
            type: "string" 
        },
        email: { 
            type: "string" 
        },
        charity_id: { 
            type: "string" 
        }
    },
    required: ["name", "email", "charity_id" ],
    additionalProperties: false
}