import dependencies from "./bootstrap/dependencies";
import errorHandler from "errorhandler";
import app from "./bootstrap/app";

/**
 * Error Handler. Provides full stack
 */
if (process.env.NODE_ENV === "development") {
    app.use(errorHandler());
}

/**
 * Start Express after we finished bootstrapping.
 */
app.on('ready', function() { 
    app.listen(app.get("port"), () => {
        console.log(
            "  App is running at http://localhost:%d in %s mode",
            app.get("port"),
            app.get("env")
        );
        console.log("  Press CTRL-C to stop\n");
    });
}); 

dependencies().then(() => {  
    app.emit('ready'); 
}).catch((err) => {
    console.error(`Fatal Error. Could not start application: ${err}`);
});

export default app;