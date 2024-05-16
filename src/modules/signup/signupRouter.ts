/**
 * The purpose of this file is to load the routes which are required to use the Search API from http.
 */

import express from "express";

import {store as storeAffiliate} from "./controllers/AffiliateController";
import {store as storeEmployer}  from "./controllers/EmployerController";
import {store as storeEmployee, uploadResume}  from "./controllers/EmployeeController";

import {readContract} from "./controllers/SignupController";
import {resend}   from "./controllers/SignupController";

import {verify} from "./controllers/VerificationController";

let signupRouter: express.Router = express.Router();

signupRouter.post("/affiliates", storeAffiliate);
signupRouter.post("/employers", storeEmployer);

signupRouter.post("/employees", storeEmployee);
signupRouter.post("/employees/:id/resume", uploadResume);

signupRouter.get("/:id/contract", readContract);
signupRouter.patch("/:id/resend", resend);

signupRouter.patch("/verify/:id", verify);

export default signupRouter;
