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
const middleware = require('./middleware');
const auth = require('./auth');
const api = require('./api');
const config = require('../config/main.config');

exports.listen = function(port) {
  // connect to db
  mongoose.connect(config.MONGO_URL);

  require('../config/passport.js')(passport);

  // middleware
  app.use(bodyParser());
  app.use(cookieParser());
  app.use(morgan('dev'));

  // authentication and templating
  app.set('view engine', 'ejs');
  app.use(session({ secret: process.env.SESSION_SECRET }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(flash());

  app.get('/', (req, res) => res.render('index.ejs'));

  // API routes
  app.use('/auth', auth);
  app.use('/api', api);

  app.listen(port, function() {
    console.log(`Spot Dawg is on port ${port}!`);
  });
};
