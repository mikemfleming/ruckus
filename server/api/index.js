'use strict';

module.exports = (app) => {
  app.use('/api/spotify', require('./spotify'));
};
