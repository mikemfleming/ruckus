'use strict';

// required dependencies
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const morgan = require('morgan');
const session = require('express-session');
const passport = require('passport');
const mongoose = require('mongoose');

// required files
const api = require('./api');
const config = require('../config/main.config');

// configure mongoose promises
mongoose.promise = Promise;

exports.listen = function(port) {
  // connect to db
  mongoose.connect(config.MONGO_URL);

  require('../config/passport.js')(passport);

  // middleware
  app.use(bodyParser());
  app.use(cookieParser());
  app.use(morgan('dev'));

  // set up passport auth and ejs templating
  app.set('view engine', 'ejs');
  app.use(session({ secret: config.SESSION_SECRET }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(flash());

  // configure routes
  require('./routes')(app);

  // API routes
  app.use('/api', api);

  app.listen(port, function() {
    console.log(`Spot Dawg is on port ${port}!`);
  });
};
