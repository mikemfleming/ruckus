'use strict';

const config = require('../../config/main.config');

exports.isAuthorized = (req, res, next) => {
  console.log('checking authorization');
  // this is where we confirm this request came from slack
  if (req.body.token !== config.SLACK_VERIFICATION_TOKEN) {
    console.log('not authorized')
    res.status(403).send('Required: Slack Verification Token\n');
    res.end();
  } else {
    next();
  }
};
