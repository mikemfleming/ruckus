'use strict';

const routes = require('express').Router();
const tracks = require('./tracks.controller');

// POST /tracks
routes.post('/tracks', tracks.add);

module.exports = routes;
