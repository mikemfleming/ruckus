'use strict';

const spotifyAuth = require('./spotify.auth');

const router = require('express').Router();

router.get('/login', spotifyAuth.login);
router.get('/callback', spotifyAuth.callback);
router.get('/refresh_token', spotifyAuth.refreshToken);

module.exports = router;
