'use strict';

exports.isAuthorized = (req, res, next) => {
  console.log('checking authorization')
  // this is where we confirm this request came from slack
  next();
};
