'use strict';

const axios = require('axios');

const slack = require('../../util/slack.util');
const spotifyAuth = require('../../auth/spotify.auth');

exports.add = function (trackId, account) {
  console.log(account)
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
      console.log('spotify ctrl error adding track', error)
      if (error.status === 401 && error.message === 'The access token expired') {
        console.log('❤️ token expired, trying again')
        spotifyAuth.refreshToken(account.userId)
        //   .then(addOnce)
      }
    });
};

function addOnce (config, token) {
  config.headers['Content-Type'] = 'Bearer ' + token;
  console.log(config.headers)
  return axios(config)
    .then((res) => res.data)
    .catch((err) => console.log('~~~~~~~~~~~~~~ retry failed'))
}