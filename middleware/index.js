'use strict';

const middleware = {};

middleware.spy = function(req, res, next) {
  console.log('begin ~~~~~~~~~~~~~~~~~~');
  console.log(`RECIEVED ${req.method} REQUEST`);
  if (Object.keys(req.body).length) {
    console.log(`BODY: ${JSON.stringify(req.body, null, 2)}`);
  }
  if (Object.keys(req.query).length) {
    console.log(`QUERY: ${JSON.stringify(req.query, null, 2)}`);
  }
  console.log('end ~~~~~~~~~~~~~~~~~~');
  next();
};

module.exports = middleware;
