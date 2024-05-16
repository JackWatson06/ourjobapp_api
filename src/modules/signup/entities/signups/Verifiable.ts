/**
 * This class will give the signup system it's desired type for signup so we know who the individual is when they
 * are signing up into our system.
 * 
 * I don't like how we handle the verification here. We are passing to many variables. There is clearly an abstraction that I am
 * missing.
 */

import { Token } from "../Token";

import { INotification } from "notify/INotification";
import { ITemplate } from "template/ITemplate";

export interface Verifiable
{
    verify(token: Token, notification: INotification, template: ITemplate): Promise<boolean>;
}
