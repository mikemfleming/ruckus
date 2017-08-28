'use strict';

const routes = require('express').Router();
const spotify = require('./spotify.controller');

// POST /tracks
routes.post('/tracks', spotify.addToPlaylist);

module.exports = routes;
  