const express = require( "express" );
const app = express();

// define a route handler for the default home page
app.get( "/", ( req: any, res: any ) => {
    res.send( "Hello Still Works!" );
} );

app.set("port", process.env.PORT || 80);

export default app;