'use strict';

// set env variables
require('dotenv').config();

const mongoose = require('mongoose');

const server = require('./server');
const config = require('./config/main.config');

server.listen(config.PORT);
