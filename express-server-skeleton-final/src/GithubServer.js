const fetch = require('node-fetch');

const clientId = process.env.client_id;
const secret = process.env.secret;

class ResponseError extends Error {
  constructor(res, body) {
    super(`${res.status} error requesting ${res.url}: ${res.statusText}`);
    this.status = res.status;
    this.path = res.url;
    this.body = body;
  }
}

class GithubServer {
  
  login() {
    const url = 'https://github.com/login/oauth/authorize';

    return fetch(url, options)
      .then(res => res.json()
        .then((data) => {
          if (!res.ok) {
            throw new ResponseError(res, data);
          }

          return data;
        }));
  }
}
