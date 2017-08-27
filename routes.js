'use strict';

const routes = require('express').Router();

routes.post('/', function (req, res) {
  res.set('Content-Type', 'text/plain');
  res.status(200).send(req.body.challenge);
  console.log('~~~~~~~~~~~~~~ RECIEVED REQUEST: ', req.body);
});

module.exports = routes;
