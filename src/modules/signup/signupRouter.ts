
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
import {store as storeAffiliate} from "./controllers/AffiliateController";
// import {store as storeEmployee}  from "./controllers/EmployeeController";
// import {store as storeEmployer}  from "./controllers/EmployerController";

import {readContract} from "./controllers/SignupController";
import {resend}   from "./controllers/SignupController";

import {verify} from "./controllers/VerifyController";

let signupRouter: express.Router = express.Router();

signupRouter.post("/affiliate", storeAffiliate);
// signupRouter.post("/employee", storeEmployee);
// signupRouter.post("/employer", storeEmployer);

signupRouter.get(":id/contract", readContract);
signupRouter.patch(":id/resend", resend);

signupRouter.patch("/verify/:id", verify);

export default signupRouter;
