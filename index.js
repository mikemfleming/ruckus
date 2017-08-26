'use strict';

const express = require('express');
const app = express();

app.post('/', function (req, res) {
  res.status(200).send('Ruff!');
  console.log('~~~~~~~~~~~~~~ RECIEVED REQUEST: ', req.body);
});

app.listen(8080, function () {
  console.log('Spot Dawg is on port 8080!')
});
