'use strict';

const request = require('request');

exports.add = (track) => {
  console.log('add track: ', track);

  const options = {
    url: `https://api.spotify.com/v1/users/1228406874/playlists/4qIaLCTPEef0Zsy8G4deZz/tracks?uris=spotify:track:${track}`,
    headers: { Authorization: 'Bearer ' + process.env.mike },
    json: true,

  };
  const callback = (err, response, body) => {
    if (err) return console.log('error ', err);
    console.log('~~~ response');
    console.log('$$$$ body', body);
  };

  request.post(options, callback);
};
