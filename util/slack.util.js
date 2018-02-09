'use strict';

const request = require('request');

const { SLACK } = require('../config/main.config');

exports.respond = () => {
  const options = {
    method: 'POST',
    uri: 'https://slack.com/api/chat.postMessage',
    form: {
      token: SLACK.BOT_TOKEN,
      channel: 'C6U6X16TU',
      text: 'Bork! Ruff.',
      as_user: false,
      username: 'spotdawg'
    }
  };
  
  request.post(options, (err, response, body) => {
    if (err) return console.log('error ', err);
    console.log('sent response to slack');
  });
};
