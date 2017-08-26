'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 8080;

const app = express();
app.use(bodyParser.json());

app.post('/', function (req, res) {
  console.log('~~~~~~~~~~~~~~ RECIEVED REQUEST: ', req.body);
  res.set('Content-Type', 'text/plain');
  res.status(200).send(req.body.challenge);
});

app.listen(8080, function () {
  console.log(`Spot Dawg is on port ${PORT}!`)
});
