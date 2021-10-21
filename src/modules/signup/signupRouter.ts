
/**
 * Original Author: Jack Watson
 * Created Date: 10/16/2021
 * Purpose: The purpose of this file is to load the routes which are required to use the Search API from http.
 * 
 * We need a way to load in the affiilate routes so we will load in the affiliate controller here.
 */

import express from "express";

// We could put index in the controllers directory.
import * as affiliate from "./controllers/AffiliateController";
import * as verification from "./controllers/VerificationController";

let signupRouter: express.Router = express.Router();

// Entites we uise to store affiliates.
signupRouter.post("/affiliates", affiliate.store);
signupRouter.post("/employers",  affiliate.store);
signupRouter.post("/employees",  affiliate.store);

// Show the actual affiliate that just signed up.
signupRouter.get("/affiliates/:id",     affiliate.show);

// Verify Email Route
signupRouter.get("/verifications/:id", verification.update);


export default signupRouter;
