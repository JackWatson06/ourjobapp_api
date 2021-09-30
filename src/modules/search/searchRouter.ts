
/**
 * Original Author: Jack Watson
 * Created Date: 9/27/2021
 * Purpose: The purpose of this file is to load the routes which are required to use the Search API from http.
 */

import express from "express";
import { index } from "./PlaceController";

let searchRouter: express.Router = express.Router();

searchRouter.get("places", index);

export default searchRouter;
