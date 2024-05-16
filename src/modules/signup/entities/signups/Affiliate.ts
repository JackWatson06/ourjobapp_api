/**
 * This class defines a new process for an affilaite to signup into our system.
 */

import { Token } from "../Token";
import { Verifiable } from "./Verifiable";
import { Contractable } from "./Contractable";

import { NewAffiliate } from "../../validators/NewAffiliateValidator";

import { INotification } from "notify/INotification";
import { ITemplate } from "template/ITemplate";

export class Affiliate implements Verifiable, Contractable
{
    private data: NewAffiliate;

    constructor(data: NewAffiliate)
    {
        this.data = data;
    }   

    public getData(): NewAffiliate
    {
        return this.data;
    }

    /**
     * Send out a new sms verification to verify that affiliate is actually a human.
     * @param token Token we are using to verify.
     * @param notification The notification service
     * @param template The template engine we are running
     */
    public async verify(token: Token, notification: INotification, template: ITemplate): Promise<boolean>
    {
        await token.addCode();
        const message: string = await template.render("text/affiliate-verification", { code: token.getCode() });

        return await notification.text({
            phone: this.data.phone,
            subject: "Get Your Link!",
            text: message
        });
    }

    /**
     * Render a new contract for an affiliate.
     * @param template Template engine we are running
     */
    public async render(template: ITemplate): Promise<string>
    {
        const today = new Date();
        const oneYearFromNow = new Date(new Date().setFullYear(today.getFullYear() + 1));
        
        // Figure out what to do here.
        // This can be abstracted out into a different entity.
        return await template.render("contracts/sharer", {
            VAR_EFFECTIVE_DATE   : (today).toLocaleDateString("en-US", {year: 'numeric', month: 'long', day: 'numeric'}),
            VAR_TERMINATION_DATE : (oneYearFromNow).toLocaleDateString("en-US", {year: 'numeric', month: 'long', day: 'numeric'}),
            VAR_PARTNER_NAME     : this.data.name,
            VAR_SHARED_NAME      : this.data.name,
            VAR_SHARED_PHONE     : this.data.phone
        });
    }
}
