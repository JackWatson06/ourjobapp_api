/**
 * Original Author: Jack Watson
 * Created Date: 10/19/2021
 * Purpose: This interface was riffed from stackoverflow. Essentially I was having type issues with the envionrment variables. 
 * Strictly due to how process env works. So we have to declare our own interface in order for certain types to be used 
 * throghout the applciations
 */

declare global {
    namespace NodeJS {
      interface ProcessEnv {
        NODE_ENV               : string,
        DOMAIN                 : string,
        CLIENT_DOMAIN          : string,
        MONGO_PORT             : number,
        MONGO_HOST             : string,
        MONGO_DB               : string,
        MONGO_EXPRESS_USERNAME : string,
        MONGO_EXPRESS_PASSWORD : string,
        MAIL_HOST              : string,
        MAIL_PORT              : number,
        MAIL_USERNAME          : string,
        MAIL_PASSWORD          : string,
        MAIL_FROM_ADDRESS      : string,
        MAIL_FROM_NAME         : string,
        SMS_NUMBER             : string,
        SMS_SECRET             : string,
        GOOGLE_API_KEY         : string,
        PAYPAL_MODE            : string,
        PAYPAL_CLIENT_ID       : string,
        PAYPAL_SECRET          : string
      }
    }
  }
  
// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {}