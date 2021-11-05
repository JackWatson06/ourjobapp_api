/**
 * Original Author: Jack Watson
 * Created At: 11/4/2021
 * Purpose: This class holds the routes for the payment API that we have. Tests are located in the integration tests for the payment
 * module.
 */


import express from "express"; 

// We could put index in the controllers directory.
// import { index as indexProperty }  from "./controllers/PlaceController";

const paymentRouter: express.Router = express.Router();

// Entites we can search through to find the one that matches closely.
// paymentRouter.get("/places",     indexProperty);
// paymentRouter.get("/charities",  indexCharity);
// paymentRouter.get("/jobs",       indexJob);

export default paymentRouter;
