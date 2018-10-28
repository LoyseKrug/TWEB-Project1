const fetch = require('node-fetch');

const clientId = process.env.client_id;
const clientSecret = process.env.secret;

class ResponseError extends Error {
  constructor(res, body) {
    super(`${res.status} error requesting ${res.url}: ${res.statusText}`);
    this.status = res.status;
    this.path = res.url;
    this.body = body;
  }
}

class Github {
  constructor({ token, baseUrl = 'https://api.github.com' } = {}) {
    this.token = token;
    this.baseUrl = baseUrl;
  }

  setToken(token) {
    this.token = token;
  }

  exchangeCodeForToken(clientCode) {
    console.log(this.baseUrl);
    const url = 'https://github.com/login/oauth/access_token';
    const options = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code: clientCode,
      }),
    };

    return fetch(url, options)
      .then(res => res.json()
        .then(token => {
          if (!res.ok) {
            throw new ResponseError(res, token);
          } else {
            console.log(`exchange ok ${JSON.stringify(token)}`);
          }
          return token;
        }));
  }

  request(path, token, opts = {}) {
    const url = `${this.baseUrl}${path}`;
    const options = {
      ...opts,
      headers: {
        Accept: 'application/vnd.github.v3+json',
        Authorization: `token ${token}`,
      },
    };

    return fetch(url, options)
      .then(res => res.json()
        .then((data) => {
          if (!res.ok) {
            throw new ResponseError(res, data);
          }

          return data;
        }));
  }

  loggedInUserRepos(token) {
    console.log(`Fetching User repo on github with token : ${token}`);
    return this.request('/user/repos?type=owner', token);
  }

  repoIssues(fullName, token) {
    return this.request(`/repos/${fullName}/issues?state=closed`, token);
  }

  repoCollaborators(fullName, token) {
    return this.request(`/repos/${fullName}/contributors`, token);
  }
}

module.exports = Github;
