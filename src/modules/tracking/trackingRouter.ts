import express from "express";

import * as cookie from "./controller/CookieController";

let cookieRouter: express.Router = express.Router();

cookieRouter.get("/affiliates", cookie.show);


export default cookieRouter;
