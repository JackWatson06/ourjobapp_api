// /**
//  * Original Author: Jack Watson
//  * Created Date: 11/28/2021
//  * Purpose: This class defines a new process for an employee to signup into our system.
//  */

// import { Token } from "../Token";
// import { SignupType } from "../Signupable";

// import { NewEmployer } from "../../validators/NewEmployerValidator";

// import { INotification } from "notify/INotification";
// import { ITemplate } from "template/ITemplate";

// export class Employer implements SignupType<NewEmployer>
// {

//     private data: NewEmployer;

//     constructor(data: NewEmployer)
//     {
//         this.data = data;
//     }   

//     /**
//      * Send out a new sms verification to verify that employee is actually a human.
//      * @param token Token we are using to verify.
//      * @param notification The notification service
//      * @param template The template engine we are running
//      */
//     public async sendVerification(token: Token, notification: INotification, template: ITemplate): Promise<boolean>
//     {
//         const binds: {} = {
//             token: token.getSecret(),
//             name: 
//         }
//         const message: string = await template.render("text/employer-verification", { secret: token.getSecret() });
//         const htmlMessage: string = await template.render("email/employer-verification", { secret: token.getSecret() });

//         return await notification.text({
//             phone: this.data.phone,
//             subject: "Submit Your Application!",
//             text: message
//         });
//     }

//     public async render(signup: Employer, template: ITemplate): Promise<string>
//     {
//         const today = new Date();
     
//         // Figure out what to do here.
//         // This can be abstracted out into a different entity.
//         return await template.render("contracts/placement", {
//             VAR_DATE_OF_AGREEMENT      : (today).toLocaleDateString("en-US", {year: 'numeric', month: 'long', day: 'numeric'}),
//             VAR_PARTNER_COMPANY_NAME   : signup.getData().company_name,
//             VAR_PARTNER_OFFICE_ADDRESS : signup.getData().address,
//             VAR_DESIGNATED_PARTY_NAME  : `${signup.getData().fname} ${signup.getData().lname}`,
//             VAR_DESIGNATED_PARTY_EMAIL : signup.getData().email
//         });
//     }

//     // === GETTERS ===
//     public getData(): NewEmployee
//     {
//         return this.data;
//     }
// }
