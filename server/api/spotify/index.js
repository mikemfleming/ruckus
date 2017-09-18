'use strict';

const router = require('express').Router();

// required files
const tracks = require('./tracks.controller');
const playlists = require('./playlists.controller');

router.post('/tracks', tracks.add);

module.exports = router;
