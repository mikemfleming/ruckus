'use strict';

// set env variables
require('dotenv').config();

// required dependencies
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

// required files, directories, and variables
const routes = require('./controllers/index');
const PORT = process.env.PORT || 8888;

// middleware
app.use(bodyParser.json());
app.use(cookieParser());

// serve static assets
app.use(express.static(__dirname + '/public'));

// begin request routing
app.use('/', routes);

// start server
app.listen(PORT, function () {
  console.log(`Spot Dawg is on port ${PORT}!`)
});
