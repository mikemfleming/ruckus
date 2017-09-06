'use strict';

const spotifyAuth = require('./spotify.auth');

module.exports = (app) => {
  app.get('/login', spotifyAuth.login);
  app.get('/callback', spotifyAuth.callback);
  app.get('/refresh_token', spotifyAuth.refreshToken);
};
