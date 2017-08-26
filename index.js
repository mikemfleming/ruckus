'use strict';

const express = require('express');
const app = express();

app.get('/', function (req, res) {
  res.status(200).send('Ruff!');
});

app.listen(8080, function () {
  console.log('Spot Dawg is on port 8080!')
});
