# Database Usage

## Monogo Migrate
We use the NPM package Mongo Migrate in order to run data migrations. A data would be a chnage in the state stored in a collection. For instance say we change the data
stored in a table we will want to update the existing data so that we can maintain a consistent clean system. Hence the purpose of a data migration.

### Overview
We store all of our migrations in the migrations folder here the database folder. All of the actual ran migrations are stored on the database under
changeLog. A migration has a up method, and a down method. The up method publishes the changes to the database, and the down method will rollback those
changes. You always want to provide a reverse method for a couple of reasons. First it helps you validate that you understand how your up method works. Additionally it 
acts as an undo method if we decide to change something back to the way it was.

### Commands

#### Run Commands
```
npm run database-status
```
This will print out the migrations that still have to be ran.

```
npm run database-rollback
```
This will run the done method for the migrations that were ran last.

```
npm run database-migrate
```
Apply the migrations that have yet to be ran.

#### Setup Commands

```
npx migrate-mongo create underscore_file_name_migration
```
Create a new migration file. 