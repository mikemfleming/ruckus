require('dotenv').config();

const {
  MONGO_URL,
  SESSION_SECRET,
  PORT,
} = require('./config/main.config');

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const mongoose = require('mongoose');
const helmet = require('helmet');
const logger = require('./logger');
const redisClient = require('./config/redis.config');

const app = express();
const router = express.Router();

const RedisStore = require('connect-redis')(session);
const pino = require('express-pino-logger')({ logger });

mongoose.promise = Promise;

// register middleware
app.use(helmet());
app.use(bodyParser());
app.use(cookieParser());
app.use(pino);

// connect to mongo
mongoose.connect(MONGO_URL);

// configure passport
require('./auth/passport.auth')(passport);

// configure redis options
const sessionOptions = {
  client: redisClient,
  ttl: 260,
};

// set up session with redis memory store
app.use(session({
  store: new RedisStore(sessionOptions),
  secret: SESSION_SECRET,
}));

// set up passport auth and ejs templating
app.set('view engine', 'ejs');
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// configure api routes
app.use('/api', router);
require('./routes/api')(router);

// configure client side routes
require('./routes/client')(app);

app.listen(PORT, () => console.log(`🐶  Ruckus is on port ${PORT}!`));
