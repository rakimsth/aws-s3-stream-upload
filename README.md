# AWS S3 Upload By Stream

#### Pre-requisite

- create the folder called `config`
- Inside config, create `local.json` and copy the `.env.example` file and paste it in the local.json with your secrets.

#### Start the server

- run using `yarn start` or `npm run start`
- Use /upload (POST) route to upload the multipart form data. You will receive JSON object, save the key attribute.
- Use /getSignedUrl (GET) route to get the signed file. Pass the key you have stored from the above route in the body.

### NOTE

By default the signed file will be available for only 1 Hour. You can change the duration between 1 hr to 12 hr.
