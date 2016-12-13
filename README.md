# topic-threads
CS 316 Project

## How to setup and run
Implement config/auth.js. App ID and App Secret can be found in Facebook developer dashboard for topic-threads app.
```
// config/auth.js
module.exports = {
  'FACEBOOK_APP_ID'      : '', // your App ID
  'FACEBOOK_APP_SECRET'  : '', // your App Secret
  'FACEBOOK_CALLBACK'    : 'http://localhost:3001/login/callback'
};
```
Insert postgres url (found in Heroku dashboard for topic-threads app) into app/models/index.js
```
// app/models/index.js
...
var DATABASE_URL = 'YOUR_POSTGRES_URL';
...
```
Run the following commands:
```
npm install
nodemon server.js
```
Navigate to localhost:3001 and follow login instructions.

Post topics under your Facebook username.

## Backend TODO
- [ ] Set up postgres dev environment to save locally instead of connecting to heroku (important especially if the application is deployed).
- [ ] Edit posts.
- [ ] Delete posts.
- [ ] Clean up controller code (next vs. res.send).
- [ ] Clean up routes (module for routes).
- [ ] Clean up React components (component hierarchy, more bite-sized components, props).
