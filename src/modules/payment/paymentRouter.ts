/**
 * Original Author: Jack Watson
 * Created At: 11/4/2021
 * Purpose: This class holds the routes for the payment API that we have. Tests are located in the integration tests for the payment
 * module.
 */


import express from "express"; 

// We could put index in the controllers directory.
import { start, success, cancel }  from "./PaymentController";

const paymentRouter: express.Router = express.Router();

// Entites we can search through to find the one that matches closely.
paymentRouter.get("/start",   start);
paymentRouter.get("/success", success);
paymentRouter.get("/cancel",  cancel);

export default paymentRouter;
