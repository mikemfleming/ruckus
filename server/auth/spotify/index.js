'use strict';

const spotifyAuth = require('./spotify.auth');

module.exports = (app) => {
  app.get('/oauth/login', spotifyAuth.login);
  app.get('/callback', spotifyAuth.callback);
  app.get('/refresh_token', spotifyAuth.refreshToken);
};
