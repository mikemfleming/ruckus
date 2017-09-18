'use strict';

// required dependencies
const express = require('express');
const app = express();
const routes = express.Router();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

// required files
const middleware = require('./middleware');
const auth = require('./auth');

exports.listen = function(port) {
  // middleware
  app.use(bodyParser.json());
  app.use(cookieParser());

  // serve static assets
  app.use(express.static(__dirname + '/../public'));

  // set up routes
  app.use('/auth', auth);

  app.listen(port, function() {
    console.log(`Spot Dawg is on port ${port}!`);
  });
};
