'use strict';

// dependencies
const config = require('../../config/main.config');

exports.spy = (req, res, next) => {
  if (config.LOG_LEVEL === 'debug') console.log(req.body);
  next();
};

exports.isAuthorized = (req, res, next) => {
  console.log('checking authorization');

  // this is where we confirm this request came from slack
  if (req.body.token !== config.SLACK_VERIFICATION_TOKEN) {
    console.log('not authorized');
    next('Required: Slack Verification Token\n');
  } else {
    next();
  }
};

exports.handleError = (err, req, res, next) => {
  res.status(500).send({ error: err });
};

exports.filter = (req, res, next) => {
  const isUserGenerated = !!req.body.event.user;
  const isChallengeRequest = req.body.type === 'url_verification';

  if (isUserGenerated) {
    next();
  } else if (isChallengeRequest) {
    res.set('Content-Type', 'text/plain');
    res.status(200).send(req.body.challenge);
  } else {
    res.end();
  }
};
