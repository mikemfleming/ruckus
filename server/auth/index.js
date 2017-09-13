'use strict';

const config = require('../../config/main.config');

module.exports = (app) => {
  // Spotify routes
  require('./spotify')(app);

  // Auth
  require('mauthra')({ app, db: config.MONGO_URL });
};
