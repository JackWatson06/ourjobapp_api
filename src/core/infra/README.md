# Infrastructure Services
The _infra_ folder contains a few general infrastructure services we use across modules in our
application. This documentation will cover relevant _.env_ variables and information about each
service.

## File System
This service acts as an abstraction of Node's _fs_ library. It allows us to write a data structure
(serialized to a string) to three separate locations listed below.
- **Document Folder**: Location for documents like resumes.
- **Cache Folder**: Used to cache *JS* objects.
- **Template Folder**: Maps to the directory we store _handlebar_ templates.

## Google API
We use the [Google Maps API](https://developers.google.com/maps) to get place autocomplete on the 
front end.

### Environment Settings
- **GOOGLE_API_KEY**: API key from the Google Maps platform.
