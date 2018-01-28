'use strict';

require('dotenv').config();

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
const pino = require('express-pino-logger')({ logger: require('./logger') });
const config = require('./config/main.config');

mongoose.promise = Promise;

// register middleware
app.use(helmet());
app.use(bodyParser());
app.use(cookieParser());
app.use(pino);

//connect to mongo
mongoose.connect(config.MONGO_URL);

// configure passport
require('./config/passport.js')(passport);

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
require('./server/routes')(app);

app.listen(config.PORT, function() {
  console.log(`🐶  Ruckus is on port ${config.PORT}!`);
});
