'use strict';

// begin express router
const routes = require('express').Router();

// required controllers
const auth = require('./auth.controller');
const tracks = require('./tracks.controller');

// GET /login
routes.get('/login', auth.login);

// GET /callback
routes.get('/callback', auth.callback);

// GET /refreshToken
routes.get('/refresh_token', auth.refreshToken);

// POST /tracks
routes.post('/tracks', tracks.add);

module.exports = routes;
