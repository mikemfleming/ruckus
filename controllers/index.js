'use strict';

// begin express router
const routes = require('express').Router();

// controllers
const tracks = require('./tracks.controller');

// authentication
const spotifyAuth = require('../auth/spotify.auth');

// GET /login
routes.get('/login', spotifyAuth.login);

// GET /callback
routes.get('/callback', spotifyAuth.callback);

// GET /refreshToken
routes.get('/refresh_token', spotifyAuth.refreshToken);

// POST /tracks
routes.post('/tracks', tracks.add);

module.exports = routes;
