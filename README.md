# unijobapp_api
Welcome to the UniJobApp API repository! This repository contains the backend code for the
UniJobApp. UniJobApp stands for Universal Job Application and matches both employers and candidates
together using advanced algorithms. This repository allows several different features including 
signup and verification for candidates and employers. Additionally, it handles
emailing every morning with matches found for the employer.

## Technical Details
Written in _TypeScript_, this project uses several different technologies. We use _MongoDB_ for the
database, _Express_ for the web server, and _Jest_ for our testing engine. We'll go into each
software more in the **Development Guide** section.

## Development Guide
In this section, we outline how to develop the UniJobApp API. We cover the development
installation process, background on the architecture, testing, and how to make changes.

### Installation

1. Gather all the necessary software from the **Dependencies** section.
2. Copy _.env.example_ to _.env_. You can keep the defaults when developing locally. Note if you
want email, text messaging, and PayPal you will have to configure those separately. The guides
below will help. After setting each account up you can copy the necessary .env variables to their
respective category.
    - [Message Bird](https://developers.messagebird.com)
    - [Node Mailer](https://nodemailer.com/usage/using-gmail/)
    - [PayPal](https://developer.paypal.com/home)
3. Run `nvm use` in the root directory.
4. Run `docker-compose up`.
5. Run `npm install`.
6. Run `docker refresh-database`

### Architecture
The application follows a 
[Hexagonal Architecture](https://herbertograca.com/2017/11/16/explicit-architecture-01-ddd-hexagonal-onion-clean-cqrs-how-i-put-it-all-together/) 
with external dependencies pushed out to the farthest edge of the application. We heavily base our
architecture on two Github projects:
- [Microsoft TypeScript Example](https://github.com/microsoft/TypeScript-Node-Starter): Generic 
TypeScript app setup.
- [White Label](https://github.com/stemmlerjs/white-label): A TypeScript project that follows the
architecture outlined by Domain Driven Design.

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

## Dependencies
- [Docker Engine](https://docs.docker.com/engine/install/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [NVM (Node Version Manager)](https://docs.docker.com/compose/install/)

## Commands

Use this command to set the node version to the version mandated by the _.nvmrc_ file.
```
nvm use
```

To start the application's docker containers run the following command. This will also start
watching the code for any src changes. If you want to run in the background use the `-d` flag to run
in detached mode. 
```
docker-compose up
```

To run a specific file as a script use the following command. 
```
npm run script -- ./{path_to_script}
```

This command will call the MatchAllCommand found in the _modules/matching/commands/_ directory. This
will run the process of determining the matches for candidates and employers.
```
npm run match
```

This command will call the EmailMatchesCommand found in the _modules/matching/commands/_ directory.
When you run this command it will send out emails for the matches that were found in the matching
process.
```
npm run email
```

This command will refresh the database to the original seed data.
```
npm run refresh-database
```

This command will seed the database with development data.
```
npm run dev-seeder
```

To run the unit test suite use the following command.
```
npm run test:unit
```

To run the integration(API) test suite use the following command.
```
npm run test:int
```

This command will run both unit and integration test suites. It will also finish with resetting
the database to its original state.
```
npm run test
```

If you want to run a single unit test you can run the following command. A similar command applies
to integration tests. To run a single integration test replace _jest.unit.config.js_ with
_jest.integration.config.js_.
```
npx jest --forceExit -c jest.unit.config.js -- {TestName}
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
