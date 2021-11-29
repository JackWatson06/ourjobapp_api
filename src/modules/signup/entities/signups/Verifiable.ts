/**
 * Original Author: Jack Watson
 * Created Date: 11/28/2021
 * Purpose: This class will give the signup system it's desired type for signup so we know who the individual is when they
 * are signing up into our system.
 */

import { Token } from "../Token";

import { INotification } from "notify/INotification";
import { ITemplate } from "template/ITemplate";

export interface Verifiable
{
    verify(token: Token, notification: INotification, template: ITemplate): Promise<boolean>;
}
