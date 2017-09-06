'use strict';

// begin express router
const routes = require('express').Router();

// required files
const tracks = require('./tracks.controller');
const playlist = require('./playlist.controller');

// POST /tracks
routes.post('/tracks', tracks.add);

module.exports = routes;
