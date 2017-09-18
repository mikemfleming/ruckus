'use strict';

const slack = {};

slack.challenge = function(req, res, next) {
  console.log('checking if its a challenge request');
  if (req.body.challenge) {
    console.log('it is a challenge request');
    res.set('Content-Type', 'text/plain');
    res.status(200).send(req.body.challenge);
  }
  next();
};

module.exports = slack;
