# OurJobApp API
Welcome to the OurJobApp API repository! This repository contains the backend code for the
OurJob.App website. OurJobApp stands for Our Job Application and matches both employers and 
candidates together using advanced algorithms. This repository allows several different features 
including signup and verification for candidates and employers. Additionally, it handles
emailing every morning with matches found for the employer.

## Technical Details
Written in _TypeScript_, this project uses several different technologies. We use _MongoDB_ for the
database, _Express_ for the web server, and _Jest_ for our testing engine. We'll go into each
software more in the **Development Guide** section.

## Development Guide
In this section, we outline how to develop the OurJobApp API. We cover the development
installation process, background on the architecture, testing, and how to make changes.

### Installation

1. Gather all the necessary software from the **Dependencies** section.
2. Copy _.env.example_ to _.env_. You can keep the defaults when developing locally. 
    - *Note:* If you want email, text messaging, and PayPal you will have to configure those 
    separately. After setting each account up you can copy the necessary .env variables to their 
    respective category. See the documentation in the _src/core/_ folder for setup information on
    each service.
3. Run `docker-compose up`.
4. Run `docker exec -t ourjobapp_api_node npm install`.
5. Run `docker exec -t ourjobapp_api_node npm run refresh-database`

### Architecture
The application follows a 
[Hexagonal Architecture](https://herbertograca.com/2017/11/16/explicit-architecture-01-ddd-hexagonal-onion-clean-cqrs-how-i-put-it-all-together/) 
with external dependencies pushed out to the farthest edge of the application. We heavily base our
architecture on two Github projects:
- [Microsoft TypeScript Example](https://github.com/microsoft/TypeScript-Node-Starter): Generic 
TypeScript app setup.
- [White Label](https://github.com/stemmlerjs/white-label): A TypeScript project that follows a 
Domain Driven Design approach.

### Design
We follow design principles set out by 
[Domain Driven Design (DDD)](https://martinfowler.com/bliki/DomainDrivenDesign.html). This means each 
module solves a specific domain problem. In DDD you work closely with Domain Experts on the subject
matter, so while designing a module consider working closely with the identified Domain Expert. DDD
also helps us navigate structuring our application since we, ideally, have a domain that stands
free from outside dependencies. We express our domain model through the use of simple _JavaScript_
objects. All services that rely on external technology (databases, notification services, 
web servers, etc.) should not be included in the domain.

### Making Changes
When introducing a new feature consider if it fits within pre-existing modules. If you decide that 
a new module fits the feature best, use the following folder structure within a module.
- **commands**: If your module takes in commands from a command line put any command controllers 
in this folder.
- **controllers**: If your module takes in web requests put any controllers in this folder.
- **entities**: Put your segmented domain classes in this folder.
- **mappers**: Mappers are part of the database service. They allow you to map your entities to a 
persistent database store.
- **repositories**: Repositories represent an abstraction of the database and act as a collection of
entity objects.
- **services**: Services are called from commands or controllers. They represent use cases that
are conducted on the entities.
- **views**: Views are returned by controllers or commands depending on how we want to visualize
queried data.

### Testing
Development on this project requires you to run the testing suite after all feature changes to
confirm expectations. To run the testing suite follow these steps:
1. Run `docker-compose up`
2. Run `docker exec -t ourjobapp_api_node npm run test`
    - _Note_ This will refresh the database after test completion. This refresh will whip any data
    added to the database and start with the initial seed data.

### Aliases
This project uses a _JavaScript_ library called _module-alias_ which allows us to alias long path
routes. You can view the paths that we have aliased in _package.json_. Remember that if you are
adding additional path aliases you must add them to _tsconfig.json_, _package.json_,
 and _jest.config.js_

### Production
On the production server, we expose two ports. We expose 8080 and 8081. We use 8080 for our _NGINX_
docker container. 8081 for our _Mongo Express_ container. The following domain names map to each
service. These are done through _NGINX_ on the server.

- api.ourjob.app: NGINX Api
- db.ourjob.app: Mongo Express Container

### PhantomJS
The Dockerfile to create the _Node_ container requires _PhantomJS_. As of January 2024, the JavaScript
community has been slowly moving away from _PhantomJS_ in favor of tools such as _Puppeteer_. We use
_PhantomJS_ in this project to render PDFs. Originally we installed _PhantomJS_ in the Node
docker container using a dockerized version of _PhantomJS_ called _phantomized_. This stopped 
working in January 2024, because the 
[_phantomized_ repository](https://github.com/dustinblackman/phantomized) was archived. To get 
_PhantomJS_ to work we had to build _phantomized_ ourselves using this fork of the original
repository.
- [phantomized Fork](https://github.com/everlytic/phantomized)

After you build the project replace _dockerized-phantomjs.tar.gz_ in the root directory of this
application and rebuild all the containers. Note there are no plans to migrate over to _Puppeteer_
given the inactive state of this project.

## Services
Our application interacts with a few external services to execute business tasks. View the
documentation in sub-directories of the _src/core_ folder to learn more about these services.

## Dependencies
- [Docker Engine](https://docs.docker.com/engine/install/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Commands
To start the application's docker containers run the following command. This will also start
watching the code for any changes. If you want to run in the background use the `-d` flag to run
in detached mode. 
```
docker-compose up
```

To run a specific file as a script use the following command. 
```
docker exec -t ourjobapp_api_node npm run script -- ./{path_to_script}
```

This command will call the MatchAllCommand found in the _modules/matching/commands/_ directory. This
will run the process of determining the matches for candidates and employers.
```
docker exec -t ourjobapp_api_node npm run match
```

This command will call the EmailMatchesCommand found in the _modules/matching/commands/_ directory.
When you run this command it will send out emails for the matches that were found in the matching
process.
```
docker exec -t ourjobapp_api_node npm run email
```

This command will refresh the database to the original seed data.
```
docker exec -t ourjobapp_api_node npm run refresh-database
```

This command will seed the database with development data.
```
docker exec -t ourjobapp_api_node npm run dev-seeder
```

To run the unit test suite use the following command.
```
docker exec -t ourjobapp_api_node npm run test:unit
```

To run the integration(API) test suite use the following command.
```
docker exec -t ourjobapp_api_node npm run test:int
```

This command will run both unit and integration test suites. It will also finish with resetting
the database to its original state.
```
docker exec -t ourjobapp_api_node npm run test
```

If you want to run a single unit test you can run the following command. A similar command applies
to integration tests. To run a single integration test replace _jest.unit.config.js_ with
_jest.integration.config.js_.
```
docker exec -t ourjobapp_api_node npx jest --forceExit -c jest.unit.config.js -- {TestName}
```

## Learn More
- [Domain Driven Design (DDD)](https://martinfowler.com/bliki/DomainDrivenDesign.html): Learn about
DDD practices.
- [Hexagonal Architecture](https://herbertograca.com/2017/11/16/explicit-architecture-01-ddd-hexagonal-onion-clean-cqrs-how-i-put-it-all-together/): 
Learn more about Hexoganol Architecture which this project follows.
- [Microsoft TypeScript Example](https://github.com/microsoft/TypeScript-Node-Starter): Learn about
creating a TypeScript project from Microsoft.
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html): Manual for
programming in TypScript.
- [White Label](https://github.com/stemmlerjs/white-label): Example TypeScript application that
follows DDD.

## Missing Features
- [] Set up continuous integration and deployment pipelines.
- [] Create a database migration process.

## Cleanup TODO
- Remove mongo-migrate
