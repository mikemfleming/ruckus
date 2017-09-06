'use strict';

// required dependencies
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

// required files, directories, and variables
const middleware = require('./middleware/index');
const routes = require('./controllers/index');

exports.listen = function(port) {
  // middleware
  app.use(bodyParser.json());
  app.use(cookieParser());
  app.use(middleware.spy);

  // serve static assets
  app.use(express.static(__dirname + '/public'));

  // begin request routing
  app.use('/', routes);

  // //Require module route files.
  // require('./lib/vendor/tu/tu.routes')(server);

  app.listen(port, function() {
    console.log(`Spot Dawg is on port ${port}!`)
  })
};

exports.close = function (callback) {
  server.close(callback);
};
