# api

## Summary of most recent changes:

- There is now a github action that will automatically deploy the webservice to Google Cloud App Engine. API is deployed here: https://self-isomate-api.appspot.com/api/
- Sorted out storing of passwords (uses hash and salt)
- Some validation has been added to check if an email or username is already in use

## Outstanding changes

- Make sure all responses follow a similar structure (bit of a mix at the moment apart from users)
