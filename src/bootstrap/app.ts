import express from "express";
import middleware from "./middleware";
import router from "./router";

// Create application
const app = express();

// Call all of our middleware on the application.
middleware(app);

// Route the current requrest
app.use('/v1', router);

export default app;