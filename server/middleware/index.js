'use strict';

// dependencies
const config = require('../../config/main.config');

exports.spy = function(req, res, next) {
  console.log('begin ~~~~~~~~~~~~~~~~~~');
  console.log(`>>> RECIEVED ${req.method} REQUEST TO ${url.parse(req.url).pathname}`);
  if (Object.keys(req.body).length) {
    console.log(`>>>> BODY: ${JSON.stringify(req.body, null, 2)}`);
  }
  if (Object.keys(req.params).length) {
    console.log(`>>>> PARAMS: ${JSON.stringify(req.params, null, 2)}`)
  }
  if (Object.keys(req.query).length) {
    console.log(`>>>> QUERY: ${JSON.stringify(req.query, null, 2)}`);
  }
  console.log('end ~~~~~~~~~~~~~~~~~~~~');
  next();
};

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

exports.challenge = (req, res, next) => {
  console.log('checking if its a challenge request');
  if (req.body.challenge) {
    console.log('it is a challenge request');
    res.set('Content-Type', 'text/plain');
    res.status(200).send(req.body.challenge);
  }
  next();
};
