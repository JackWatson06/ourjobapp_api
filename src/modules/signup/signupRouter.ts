
/**
 * Original Author: Jack Watson
 * Created Date: 10/16/2021
 * Purpose: The purpose of this file is to load the routes which are required to use the Search API from http.
 * 
 * This can 100% be all merged into 4 simple routes. The amount of routes we have here is frankly disgusting. But thats
 * what you get when you try to rush architecutre into a sleep depraved grind.
 */

import express from "express";

// We could put index in the controllers directory.
import * as affiliate from "./controllers/AffiliateController";
import * as employee from "./controllers/EmployerController";
import * as employer from "./controllers/EmployeeController";

let signupRouter: express.Router = express.Router();

// Routes we use to interact with the employee signup REST endpoints
signupRouter.post("/employees",         employee.store);
signupRouter.post("/employees/resend",  employee.resend);
signupRouter.post("/employees/verify",  employee.verify);

// Routes we use to interact with the employers signup REST endpoints
signupRouter.post("/employers",         employer.store);
signupRouter.post("/employers/resend",  employer.resend);
signupRouter.post("/employers/verify",  employer.verify);

// Routes we use to interact with the affiliates signup REST endpoints... Note right now the frontend calls affiliates ... share. This may change
// but that is why you see it here since the front end proxy requests back here.
signupRouter.post("/affiliates",         affiliate.store);
signupRouter.post("/affiliates/resend",  affiliate.resend);
signupRouter.post("/affiliates/verify",  affiliate.verify);

export default signupRouter;
