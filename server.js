'use strict';
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 8080;

const routes = require('./controllers/index');

const app = express();
app.use(bodyParser.json());

app.use('/', routes);

app.listen(PORT, function () {
  console.log(`Spot Dawg is on port ${PORT}!`)
});
