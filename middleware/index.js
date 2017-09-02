'use strict';

const middleware = {};

middleware.spy = function(req, res, next) {
  console.log(`~~~~~~~~~~~~~~~~ RECIEVED ${req.method} REQUEST\n BODY: ${JSON.stringify(req.body, null, 2)}`);
  next();
};

module.exports = middleware;
