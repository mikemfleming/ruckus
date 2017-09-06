'use strict';

// set env variables
require('dotenv').config();

const server = require('./server');
const config = require('./config/main.config');

server.listen(config.PORT);
