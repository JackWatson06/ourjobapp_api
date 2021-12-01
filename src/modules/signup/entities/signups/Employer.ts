/**
 * Original Author: Jack Watson
 * Created Date: 11/28/2021
 * Purpose: This class defines a new process for an employee to signup into our system.
 */

import { Token } from "../Token";
import { Verifiable } from "./Verifiable";
import { Contractable } from "./Contractable";
import { Address } from "../Address";

import { NewEmployer } from "../../validators/NewEmployerValidator";

import { INotification } from "notify/INotification";
import { ITemplate } from "template/ITemplate";

export class Employer implements Verifiable, Contractable
{
    private id: string;
    private data: NewEmployer;
    private address?: Address;
    
    constructor(id: string, data: NewEmployer, address ?: Address)
    {
        this.id      = id;
        this.data    = data;
        this.address = address;
    }   

    /**
     * Send out a new sms verification to verify that employee is actually a human.
     * @param token Token we are using to verify.
     * @param notification The notification service
     * @param template The template engine we are running
     */
    public async verify(token: Token, notification: INotification, template: ITemplate): Promise<boolean>
    {
        const binds: {} = {
            contract_link : `${process.env.DOMAIN}/api/v1/signup/${this.id}/contract`,
            verify_link   : `${process.env.CLIENT_DOMAIN}/verify/employer/${token.getSecret()}`,
            name          : `${this.data.fname} ${this.data.lname}`
        };
        const message: string     = await template.render("text/employer-verification", binds);
        const htmlMessage: string = await template.render("email/employer-verification", binds);

        return await notification.email({
            address : this.data.email,
            subject : "Submit Your Application!",
            text    : message,
            html    : htmlMessage
        });
    }

    public async render(template: ITemplate): Promise<string>
    {
        const today = new Date();
     
        // Figure out what to do here.
        // This can be abstracted out into a different entity.
        return await template.render("contracts/placement", {
            VAR_DATE_OF_AGREEMENT      : (today).toLocaleDateString("en-US", {year: 'numeric', month: 'long', day: 'numeric'}),
            VAR_PARTNER_COMPANY_NAME   : this.getData().company_name,
            VAR_PARTNER_OFFICE_ADDRESS : this.address?.getAddress() ?? "No Address",
            VAR_DESIGNATED_PARTY_NAME  : `${this.getData().fname} ${this.getData().lname}`,
            VAR_DESIGNATED_PARTY_EMAIL : this.getData().email
        });
    }

    // === GETTERS ===
    public getData(): NewEmployer
    {
        return this.data;
    }

    public getId(): string
    {
        return this.id;
    }
}
