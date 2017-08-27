'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const routes = require('./routes');

const app = express();
app.use(bodyParser.json());

app.use('/', routes);

app.listen(8080, function () {
  console.log('Spot Dawg is on port 8080!')
});
