'use strict';

const log = require('../../logger');
const { SLACK } = require('../../config/main.config');

exports.isAuthorized = function (req, res, next) {
  log.info('CHECKING AUTHORIZATION');

  // this is where we confirm this request came from slack
  if (req.body.token !== SLACK.VERIFICATION_TOKEN) {
    log.error('UNAUTHORIZED');
    next('Required: Slack Verification Token\n');
  } else {
    next();
  }
};

exports.isLoggedIn = function (req, res, next) {
  log.info('CHECKING IF LOGGED IN');
  if (req.isAuthenticated()) {
    log.info('IS LOGGED IN');
    return next();
  }
  log.error('IS NOT LOGGED IN, REDIRECTING TO HOME');
  res.redirect('/');
};

exports.handleError = function (err, req, res, next) {
  log.error(err);
  res.status(500).send({ error: err });
};

exports.slack = function (req, res, next) {
  const isUserGenerated = !!req.body.event && req.body.event.user;
  const isChallengeRequest = req.body.type === 'url_verification';

  if (isUserGenerated) {
    next();
  } else if (isChallengeRequest) {
    log.info('RESPONDING TO SLACK URL CHALLENGE REQUEST');
    res.set('Content-Type', 'text/plain');
    res.status(200).send(req.body.challenge);
  } else {
    res.end();
  }
};
