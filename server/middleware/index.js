'use strict';

const logger = require('../../logger');
const config = require('../../config/main.config');

exports.isAuthorized = (req, res, next) => {
  logger.info('CHECKING AUTHORIZATION');

  // this is where we confirm this request came from slack
  if (req.body.token !== config.SLACK_VERIFICATION_TOKEN) {
    logger.error('UNAUTHORIZED');
    next('Required: Slack Verification Token\n');
  } else {
    next();
  }
};

exports.isLoggedIn = (req, res, next) => {
  logger.info('CHECKING IF LOGGED IN');
  if (req.isAuthenticated()) {
    logger.info('IS LOGGED IN');
    return next();
  }
  logger.error('IS NOT LOGGED IN, REDIRECTING TO HOME');
  res.redirect('/');
};

exports.handleError = (err, req, res, next) => {
  logger.error(err);
  res.status(500).send({ error: err });
};

exports.filter = (req, res, next) => {
  const isUserGenerated = !!req.body.event && req.body.event.user;
  const isChallengeRequest = req.body.type === 'url_verification';

  if (isUserGenerated) {
    next();
  } else if (isChallengeRequest) {
    logger.info('RESPONDING TO SLACK URL CHALLENGE REQUEST');
    res.set('Content-Type', 'text/plain');
    res.status(200).send(req.body.challenge);
  } else {
    res.end();
  }
};
