
/**
 * The purpose of this file is to load the routes which are required to use the Search API from http.
 * 
 * Note this search may change at some point if the boundries of this application change. For instance I could see
 * the jobs section of this being moved to the employee section. The entities should be close to where they are actually
 * used in the domain.
 */

import express from "express";

// We could put index in the controllers directory.
import { index as indexProperty }  from "./controllers/PlaceController";
import { index as indexCharity }   from "./controllers/CharityController";
import { index as indexJob }       from "./controllers/JobController";
import { index as indexJobGroup }  from "./controllers/JobGroupController";
import { index as indexMajor }     from "./controllers/MajorController";
import { index as indexCountries } from "./controllers/CountryController";

import {affiliateLink} from "./controllers/ExistingLinkController";
import {employerEmail} from "./controllers/ExistingEmailController";
import {employeePhone} from "./controllers/ExistingPhoneController";

let searchRouter: express.Router = express.Router();

searchRouter.get("/places",     indexProperty);
searchRouter.get("/charities",  indexCharity);
searchRouter.get("/jobs",       indexJob);
searchRouter.get("/job-groups", indexJobGroup);
searchRouter.get("/majors",     indexMajor);
searchRouter.get("/countries",  indexCountries);


searchRouter.get("/existing/affiliate",  affiliateLink);
searchRouter.get("/existing/employee",   employeePhone);
searchRouter.get("/existing/employer",   employerEmail);

export default searchRouter;
