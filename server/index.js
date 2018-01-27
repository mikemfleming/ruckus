'use strict';

// required dependencies
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const redisClient = require('redis').createClient();
const passport = require('passport');
const mongoose = require('mongoose');
const helmet = require('helmet');
const pino = require('express-pino-logger')({ logger: require('../logger') });

// required files
const api = require('./api');
const config = require('../config/main.config');

// configure mongoose promises
mongoose.promise = Promise;

exports.listen = function(port) {
  // middleware
  app.use(helmet());
  app.use(bodyParser());
  app.use(cookieParser());
  app.use(pino);
  
  // connect to db
  mongoose.connect(config.MONGO_URL);

  require('../config/passport.js')(passport);

  // configure redis options
  const sessionOptions = {
    host: 'localhost',
    port: config.REDIS_PORT,
    client: redisClient,
    ttl: 260
  };

  // set up session with redis memory store
  app.use(session({
    store: new RedisStore(sessionOptions),
    secret: config.SESSION_SECRET
  }));

  // set up passport auth and ejs templating
  app.set('view engine', 'ejs');
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(flash());

  // configure client side routes
  require('./routes')(app);

  // configure API routes
  app.use('/api', api);

  app.listen(port, function() {
    console.log(`Spot Dawg is on port ${port}!`);
  });
};
