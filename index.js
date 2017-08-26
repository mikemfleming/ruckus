'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

app.post('/', function (req, res) {
  res.set('Content-Type', 'text/plain');
  res.status(200).send(req.body.challenge);
  console.log('~~~~~~~~~~~~~~ RECIEVED REQUEST: ', req.body);
});

app.listen(8080, function () {
  console.log('Spot Dawg is on port 8080!')
});
