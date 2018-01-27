'use strict';

const axios = require('axios');

const slack = require('../../util/slack.util');
const spotifyAuth = require('../../auth/spotify.auth');

exports.add = function (trackId, account) {
  const config = {
    url: 'https://api.spotify.com/v1/users/1228406874/playlists/4qIaLCTPEef0Zsy8G4deZz/tracks',
    method: 'post',
    headers: { 
      Authorization: 'Bearer ' + account.accessToken,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    params: {
      uris: `spotify:track:${trackId}`
    }
  };

  axios(config)
    .then(x => console.log('~~~~~~~~~~~~~~ added track'))
    .catch((error) => {
      console.log('spotify ctrl error adding track', error.response.status)
      if (error.response.status === 401) {
        console.log('❤️ token expired, trying again')
        spotifyAuth.refreshToken(account.userId)
        //   .then(addOnce)
      }
    });
};

function addOnce (config, token) {
  config.headers['Content-Type'] = 'Bearer ' + token;
  return axios(config)
    .then((res) => res.data)
    .catch((err) => console.log('~~~~~~~~~~~~~~ retry failed'))
}