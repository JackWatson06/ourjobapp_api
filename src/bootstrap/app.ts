import express from "express";
import middleware from "./middleware";
import router from "./router";

const app = express();

app.set("port", 80);
middleware(app);
app.use('/api/v1', router);

export default app;