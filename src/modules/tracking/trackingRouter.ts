import express from "express";

// We could put index in the controllers directory.
import * as cookie from "./controller/CookieController";

let cookieRouter: express.Router = express.Router();

// Entites we uise to store affiliates.
cookieRouter.get("/affiliates", cookie.show);


export default cookieRouter;
