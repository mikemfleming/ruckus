'use strict';

// required dependencies
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

// required files
const middleware = require('./middleware');
const config = require('../config/main.config');

exports.listen = function(port) {
  // middleware
  app.use(bodyParser.json());
  app.use(cookieParser());
  // app.use(middleware.spy);

  // serve static assets
  // app.use(express.static(__dirname + '/../public')); // previously used for spotify auth

  // set up routes
  require('./api')(app);
  require('./auth')(app);

  app.listen(port, function() {
    console.log(`Spot Dawg is on port ${port}!`);
  });
};
