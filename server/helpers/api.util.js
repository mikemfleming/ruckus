'use strict';

exports.isAuthorized = (req, res, next) => {
  // this is where we confirm this request came from slack
  next();
};
