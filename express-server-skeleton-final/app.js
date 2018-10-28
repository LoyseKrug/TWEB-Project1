// loads environment variables
require('dotenv/config');

// pour le serveur web
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const Github = require('./src/Github');
const utils = require('./src/utils');

const app = express();
const port = process.env.PORT || 3000;
const client = new Github({ token: process.env.OAUTH_TOKEN });

// Enable CORS for the client app
app.use(cors());
app.use(cookieParser());

app.get('/githubredirect', (req, res, next) => { // eslint-disable-line no-unused-vars
  console.log('/githubredirect');
  console.log(`You have been redirected, code : ${req.query.code}`);
  client.exchangeCodeForToken(req.query.code)
    .then(token => {
      console.log(JSON.stringify(token));
      res.send(token);
    })
    .catch(next);
});

app.get('/auth/myrepos', (req, res, next) => { // eslint-disable-line no-unused-vars
  console.log(`/auth/myrepos with token : ${req.query.access_token}`);
  client.loggedInUserRepos(req.query.access_token)
    .then(repos => res.send(repos))
    .catch(next);
});

app.get('/auth/:owner/:repo/issues', (req, res, next) => {
  console.log('get issues from repo');
  client.repoIssues(`${req.params.owner}/${req.params.repo}`, req.query.access_token)
    .then(issues => res.send(issues))
    .catch(next);
});

app.get('/auth/:owner/:repo/contributors', (req, res, next) => {
  console.log('get contributors from repo');
  client.repoCollaborators(`${req.params.owner}/${req.params.repo}`, req.query.access_token)
    .then(collaborators => res.send(collaborators))
    .catch(next);
});
/*
app.get('/users/:username', (req, res, next) => { // eslint-disable-line no-unused-vars
  client.user(req.params.username, req.cookies('access_token'))
    .then(user => res.send(user))
    .catch(next);
});

app.get('/languages/:username', (req, res, next) => { // eslint-disable-line no-unused-vars
  client.userLanguages(req.params.username, req.cookies('access_token'))
    .then(utils.getReposLanguagesStats)
    .then(stats => res.send(stats))
    .catch(next);
});
*/

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

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening at http://localhost:${port}`);
});
