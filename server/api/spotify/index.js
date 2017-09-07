'use strict';

// begin express router
const routes = require('express').Router();

// required files
const tracks = require('./tracks.controller');
const playlists = require('./playlists.controller');

// POST /tracks
routes.post('/tracks', tracks.add);

module.exports = routes;
