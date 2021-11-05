# unijobapp_api
UniJobApp API is the application programing interface into our core application in the backend of our entire system.

## Installation

- Download the initially seed database from google drive.
    - https://drive.google.com/drive/u/3/folders/1xjfqHakn3tnhLsu0DIO2RnfRBt-8kHDf
    - Download all .json files and store in the "scripts/raw-data" directory
- Run docker-compose up
- Run npm install
- Run docker refresh-database

## Dependencies
    - Docker
    - Docker Compose
    - NPM (Striclty for running commands, Node and NPM are handled in the docker container. That way we can share versions)

## Structure
The structuure of this applicaiton is based heavily on two github repositories.
- [Microsoft Typescript Example](https://github.com/microsoft/TypeScript-Node-Starter) : Generic app setup
- [White Label](https://github.com/stemmlerjs/white-label) : A domain driven design implementation of Typscript

## Why Are We Using DDD
We are using DDD because I find that it allows you to create more scalable applications. Obviously, you're going to say why would you start doing DDD from the beginning if you don't even know your application has a valid market fit (I would ask that at least). To that, I say fair point. It does require more upfront time. But on the off chance that we do have market fit at least, we'll be able to have less technical debt thus hopefully giving us a more headstart if we do become successful. Lastly, I think this application works well with DDD because there will be complex business logic built into the affiliate program.

## Production

In productiuno this applicatino exposes two ports on the server. The first being 8080, and the second being 8081. 8080 for our copy of NGINX so we can have inter-container communication and to hide away our database. The second being 8081 for Mongo Express. We have the iptables rules set on the server such that we restrict access to these ports only on the case of our servers NGINX
proxy redirect to these ports. So what this means is that they are ONLY accessible through SSL and no other communicates. The following URLs map to our corresponding ports.

- db.ourjob.app   : Mongo Express Container
- api.ourjob.app  : NGINX Api

## Commands

    docker-compose up
This command will create all of the reqiured containers, and also start watching the codebase for any changes that occur. You should be able to view the output of the node container in the terminal after running.

    npm run refresh-database
This command will refresh the database to it's initial seed data. Us

    npm run script -- ./script_name
This command allows you to run a script on the actual docker container. You need to do this in order to get access to the database since that is not exposed on a port to the client only wihtin the network created by docker. Node you need to have the ./ for the script-runner to know what file to pull down.

## Aliases

We alias our libraries so that the import statement does not go to long. In order to edit or change these aliases use the tsconfig.json file in the root directory. Additionaly if you are
going to be using this directory during your tests you will want to add it to the jest.config.js as well!

## Directory Structure

    - public : Directory which serves up static files that will not change. We simply copy contents in this file to the dist on build.
    - scripts : Any general scripts which are relevent to the project. For instance turning the charities excel sheet => charities json data. Only useful for development. Any packages installed for this process should be done with the --save-dev
    - seeders : Scripts which that add data into the mongoDB databse. Call using `node ./seeders/seed.ts`
    - src
        - bootstrap : Build the application
        - core : Any core services that we have. (a.k.a) MongoDB, GoogleAPI, AutoMappers
        - modules : Different bounded contexts for our domain (dictated by Use Cases)
            - [Module Name]
                - controllers : HTTP Endpoints which control the flow of data into other areas, and return a JSON view-model
                - dto : A data transfer object. The view model that whatever client is interacting with our database should see.
                - entities : The domain entities that are in this context. Can have more than one aggregate-root. Sub-Directories will be on a per-module basis.
                - mappers : Infastructure layer mappers for the entities.
                (router.ts) : The router for this context which handles where the data should go in the service.

