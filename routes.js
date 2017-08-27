'use strict';

const routes = require('express').Router();

routes.post('/', function (req, res) {
  res.set('Content-Type', 'text/plain');
  res.status(200).send(req.body.challenge);
  console.log('~~~~~~~~~~~~~~ RECIEVED REQUEST: ', req.body);
  console.log(Object.keys(req.body.event.channel));
  console.log('CHANNEL_ID', process.env.CHANNEL_ID);
  console.log(`is from target channel? ${process.env.CHANNEL_ID === req.body.event.channel}`)
});

module.exports = routes;
