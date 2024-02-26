# Database Service
We use MongoDB for our persistence layer. Collections follow a schema defined in _./DatabaseSchema_. 
This document covers relevant _.env_ variables and the use of _MongoDB_ in the application. 

## Environment Settings
- MONGO_PORT: Port our _MongoDB_ server runs on.
- MONGO_HOST: Name of the host running our _MongoDB_ server.
- MONGO_DB: Default database for our application.

## Mongo DB
To interface with the database simply import the _collections_ variable found in the _./MongoDb.ts_
file. Using this variable you can access our collections which are strongly typed. In addition, 
when working with our database you can import the schemas from the _./DatabaseSchema.ts_ file or 
the constants from the _./Constants.ts_ file to strongly type your variables.