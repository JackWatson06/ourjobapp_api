
/**
 * Original Author: Jack Watson
 * Created Date: 9/27/2021
 * Purpose: The purpose of this file is to load the routes which are required to use the Search API from http.
 * 
 * Note this search may change at some point if the boundries of this application change. For instance I could see
 * the jobs section of this being moved to the employee section. The entities should be close to where they are actually
 * used in the domain.
 */

import express from "express";

// We could put index in the controllers directory.
import { index as indexProperty } from "./controllers/PlaceController";
import { index as indexCharity }  from "./controllers/CharityController";
import { index as indexJob }      from "./controllers/JobController";
import { index as indexJobGroup } from "./controllers/JobGroupController";
import { index as indexMajor }    from "./controllers/MajorController";

let searchRouter: express.Router = express.Router();

// Entites we can search through to find the one that matches closely.
searchRouter.get("/places", indexProperty);
searchRouter.get("/charities", indexCharity);
searchRouter.get("/jobs", indexJob);
searchRouter.get("/job-groups", indexJobGroup);
searchRouter.get("/majors", indexMajor);

export default searchRouter;
