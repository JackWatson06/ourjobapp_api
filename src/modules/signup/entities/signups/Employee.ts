/**
 * Original Author: Jack Watson
 * Created Date: 11/28/2021
 * Purpose: This class defines a new process for an employee to signup into our system.
 */

import { Token } from "../Token";
import { Verifiable } from "./Verifiable";

import { NewEmployee } from "../../validators/NewEmployeeValidator";

import { INotification } from "notify/INotification";
import { ITemplate } from "template/ITemplate";

export class Employee implements Verifiable
{
    private data: NewEmployee;

    constructor(data: NewEmployee)
    {
        this.data = data;
    }   

    public getData(): NewEmployee
    {
        return this.data;
    }

    /**
     * Send out a new sms verification to verify that employee is actually a human.
     * @param token Token we are using to verify.
     * @param notification The notification service
     * @param template The template engine we are running
     */
    public async verify(token: Token, notification: INotification, template: ITemplate): Promise<boolean>
    {
        await token.addCode();
        const message: string = await template.render("text/employee-verification", { code: token.getCode() });

        return await notification.text({
            phone: this.data.phone,
            subject: "Submit Your Application!",
            text: message
        });
    }
}
