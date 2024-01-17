# Payment Module
The matching module is in charge of matching an employer with an employee. We have this hooked up to a crontab such that
every Tues & Thurs we will be running this and generating a list of matches. These matches are stored in the database under the
following collections:
    - Batch      : The batch number for when this was ran.
    - BatchMatch : The employers that were in this batch.
    - Match      : The employees that the employers matched (Has a batchmatch id)
    - Email      : Record of the emails we sent out of this application.

## How It Works

## TODO
- Abstract the employees, and the employers out into their own entities.