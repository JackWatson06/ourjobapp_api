import express from "express";
import middleware from "./middleware";
import router from "./router";

// Create application
const app = express();

app.set("port", 80);

// Call all of our middleware on the application.
middleware(app);

// Route the current requrest
app.use('/api/v1', router);

export default app;