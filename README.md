# unijobapp_api
UniJobApp API is the application programing interface into our core application in the backend of our entire system.

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

## Commands

    docker-compose up
This command will create all of the reqiured containers, and also start watching the codebase for any changes that occur. You should be able to view the output of the node container in the terminal after running.
