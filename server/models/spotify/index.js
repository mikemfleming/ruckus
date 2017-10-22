'use strict';

const request = require('request');

const config = require('../../../config/main.config');
const slack = require('../../util/slack.util');
const User = require('../users');

exports.add = (trackId, options) => {
  

	console.log(trackId, options)



  // const options = {
  //   url: `https://api.spotify.com/v1/users/1228406874/playlists/4qIaLCTPEef0Zsy8G4deZz/tracks?uris=spotify:track:${track}`,
  //   headers: { Authorization: 'Bearer ' + process.env.mike }, // garbage code
  //   json: true,

  // };

  // const callback = (err, response, body) => {
  //   if (err || body.error) return console.log('error ', body.error);
  //   slack.respond();
  // };



  // request.post(options, callback);
};
