# Matching Module

The matching module handles the process of matching a candidate with an employer based on each
party's search requirement. We hooked up _Crontab_ to this module to send out emails of the matches
to employers every Tuesday and Thursday.

## Domain Concepts

There are a few domain concepts stored in the _entities_ folder which are discussed below.
- **Batch**: The batch represents a single running of the matching algorithm. The batch holds all of 
    the matches found.
- **BatchMatch**: Every employer has a BatchMatch. A BatchMatch matches an employer with any number 
    of candidates.
- **Match**: The candidates that matched with the employer's BatchMatch.
- **Email**: The record of emails we sent out from the application.

## TODO
- [] Abstract the employees, and the employers out into custom entities.
