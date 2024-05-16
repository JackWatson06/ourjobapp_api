/**
 * This interface provides the base requirements that a notification service must match. Since we are combining
 * scope here it is interesting to observe the fact that this now increases the ability of the service, while also exposing
 * more implementation details than we need a given moment. This also simply allows us to pass around a single notification
 * object rather than having to decide during compile time, we can decide during runtime. Tradeoffs, tradeoffs.
 */

import { Email } from "./messages/Email";
import { Text } from "./messages/Text";

interface INotification 
{    
    email(email: Email): Promise<boolean>;
    text(text: Text): Promise<boolean>;
}

export {INotification}