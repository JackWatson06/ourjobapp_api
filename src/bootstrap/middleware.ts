/**
 * Original Author: Jack Watson
 * Created Date: 9/27/2021
 * Purpose: The purpose of this function is to apply middleware to an instance of an application. Specificallyh this
 * middleware is built around the UniJobApp use case. We are using several frameworks in order to protect, and improve
 * the application.
 */

import * as app from 'express-serve-static-core';

import lusca from "lusca";
import compression from "compression";

/**
 * Apply middleware to the passed in application.
 * @param app Instance of the express application
 */
export default function(app: app.Express) : void
{
    app.use(compression());
    app.use(lusca.xframe("SAMEORIGIN"));
    app.use(lusca.xssProtection(true));
}


