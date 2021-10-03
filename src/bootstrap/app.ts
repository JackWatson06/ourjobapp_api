import express from "express";
import bootstrap from "./dependencies";
import middleware from "./middleware";
import router from "./router";

// Create application
const app = express();

app.set("port", process.env.PORT || 3000);

// Bootstrap the required dependencies in the application.
bootstrap();

// Call all of our middleware on the application.
middleware(app);

// Route the current requrest
app.use('/api/v1', router);

export default app;