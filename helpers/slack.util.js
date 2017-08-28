'use strict';

const slack = {};

slack.sendOkStatus = function(req, res) {
  res.set('Content-Type', 'text/plain');
  res.status(200).send(req.body.challenge);
};

module.exports = slack;
