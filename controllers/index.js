'use strict';

const routes = require('express').Router();
const spotify = require('./spotify.controller');

routes.post('/', function (req, res) {
  res.set('Content-Type', 'text/plain');
  res.status(200).send(req.body.challenge);

  if (req.body.event.channel === process.env.CHANNEL_ID) {
    return spotify.addToPlaylist(req.body.event.text);
  }
});

module.exports = routes;
  