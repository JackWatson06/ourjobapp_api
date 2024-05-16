/**
 * This file holds a simple value object for the data for the form that we just uploaded.
 */

import { Form } from "./Form";
import { NewAffiliate } from "modules/signup/validators/NewAffiliateValidator";

export class Affiliate implements Form
{
    private data: NewAffiliate

    constructor(data: NewAffiliate)
    {
        this.data = data;
    }

    public getData(): NewAffiliate
    {
        return this.data;
    }
}
