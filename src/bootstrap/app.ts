import express from "express";
import middleware from "./middleware";
import router from "./router";

import * as dotenv from "dotenv";
dotenv.config()

// Create application
const app = express();

app.set("port", process.env.PORT || 3000);

// Call all of our middleware on the application.
middleware(app);

// Route the current requrest
app.use('/api/v1', router);

export default app;