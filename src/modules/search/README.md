# Search Module
The search module allows us to search through several different collections in our system
for the user signup process. We use this module to confirm unique emails or pull up a list of
all the charities our system supports.

## Domain Concepts
The following list represents key domain concepts:
- **DictionaryResults**: These represent key and value pairs.
    - **Charities**: Collection of valid charity entries from the database.
    - **Country**: Collection of valid countries from the database.
    - **Job**: Collection of valid jobs from the database.
    - **Job Group**: Collection of valid job groups from the database. A job group would be a category
    like IT.
    - **Place**: A place from _GoogleMaps_.
- **Existing Resource**: Resources that already exist in our system. We use this to check for existing
emails, phone numbers, or affiliate link names.
