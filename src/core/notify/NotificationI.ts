/**
 * Original Author: Jack Watson
 * Created Date: 11/17/2021
 * Purpose: This interface provides the base requirements that a notification service must match.
 */

interface NotificationI<T> {
    send(message: T): Promise<boolean>
    render(message: T, binds: {}): Promise<T>
}

export {NotificationI}