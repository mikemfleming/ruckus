'use strict';
require('dotenv').config();

const express = require('express');
const app = express();
const routes = require('./controllers/index');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 8080;

app.use(bodyParser.json());

app.use('/', routes);

app.listen(PORT, function () {
  console.log(`Spot Dawg is on port ${PORT}!`)
});
