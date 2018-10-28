// loads environment variables
require('dotenv/config');

// pour le serveur web
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const Github = require('./src/Github');

const app = express();
const port = process.env.PORT || 3000;
const client = new Github({ token: process.env.OAUTH_TOKEN });

// Enable CORS for the client app
app.use(cors());
app.use(cookieParser());

// for exhanges the github code against a user token
app.get('/githubredirect', (req, res, next) => { // eslint-disable-line no-unused-vars
  console.log(`/githubredirect ${req.query.code}`);
  client.exchangeCodeForToken(req.query.code)
    .then(token => {
      console.log(JSON.stringify(token));
      res.send(token);
    })
    .catch(next);
});

// lists repo owned by authenticated user
app.get('/auth/myrepos', (req, res, next) => { // eslint-disable-line no-unused-vars
  console.log('/auth/myrepos');
  client.loggedInUserRepos(req.query.access_token)
    .then(repos => res.send(repos))
    .catch(next);
});

// gets a list of issues
app.get('/auth/:owner/:repo/issues', (req, res, next) => {
  console.log('/auth/:owner/:repo/issues');
  client.repoIssues(`${req.params.owner}/${req.params.repo}`, req.query.access_token)
    .then(issues => res.send(issues))
    .catch(next);
});

// gets a list of contributors
app.get('/auth/:owner/:repo/contributors', (req, res, next) => {
  console.log('/auth/:owner/:repo/contributors');
  client.repoCollaborators(`${req.params.owner}/${req.params.repo}`, req.query.access_token)
    .then(collaborators => res.send(collaborators))
    .catch(next);
});

// Forward 404 to error handler
app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

// Error handler
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  console.error(err);
  res.status(err.status || 500);
  res.send(err.message);
});

// run the server
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening at http://localhost:${port}`);
});
