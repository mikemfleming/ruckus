'use strict';

const request = require('request');

const config = require('../../../config/main.config');

exports.add = (track) => {
  console.log('add track: ', track);

  const options = {
    url: `https://api.spotify.com/v1/users/1228406874/playlists/4qIaLCTPEef0Zsy8G4deZz/tracks?uris=spotify:track:${track}`,
    headers: { Authorization: 'Bearer ' + process.env.mike },
    json: true,

  };
  const callback = (err, response, body) => {
    if (err) return console.log('error ', err);
    console.log('body: ', body);

    const options = {
      method: 'POST',
      uri: 'https://slack.com/api/chat.postMessage',
      form: {
        token: config.SLACK_BOT_TOKEN,
        channel: 'C6U6X16TU',
        text: 'Bork! Ruff.',
        as_user: false,
        username: 'spotdawg'
      }
    };

    request.post(options, (err, response, body) => {
      if (err) return console.log('error ', err);
      console.log('inner response', response);
      console.log('inner body', body);
    });
  };

  request.post(options, callback);
};
