import { JSONSchemaType } from "ajv";

export interface NewAffiliate {
    name          : string
    phone         : string
    charity_id    : string
    affiliate_id ?: string
  }
  
export const schema: JSONSchemaType<NewAffiliate> = {
    type: "object",
    properties: {
        name: { 
            type: "string" 
        },
        phone: { 
            type: "string" 
        },
        charity_id: { 
            type: "string" 
        },
        affiliate_id: { 
            type: "string",
            nullable: true 
        }
    },
    required: ["name", "phone", "charity_id" ],
    additionalProperties: false
}