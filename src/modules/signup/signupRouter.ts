
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
import * as employee from "./controllers/EmployeeController";
import * as employer from "./controllers/EmployerController";
import * as resume from "./controllers/ResumeController";
import * as contract from "./controllers/ContractController";

let signupRouter: express.Router = express.Router();

// Handle viewing contracts if the user has yet to be validated.
signupRouter.get("/contracts/:id", contract.show)

// Routes we use to interact with the employee signup REST endpoints
signupRouter.post("/employees",             employee.store);
signupRouter.post("/employees/verify/:id",  employee.verify);
signupRouter.post("/resumes",               resume.store);

// Routes we use to interact with the employers signup REST endpoints
signupRouter.post("/employers",         employer.store);
signupRouter.post("/employers/verify",  employer.verify);


// Routes we use to interact with the affiliates signup REST endpoints... Note right now the frontend calls affiliates ... share. This may change
// but that is why you see it here since the front end proxy requests back here.
signupRouter.post("/affiliates",            affiliate.store);
signupRouter.post("/affiliates/verify/:id", affiliate.verify);

export default signupRouter;
