'use strict';

const axios = require('axios');

const logger = require('../logger');

const slack = require('../util/slack.util');
const spotifyAuth = require('../auth/spotify.auth');

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
    .then(() => logger.info('ADDED TRACK'))
    .catch((error) => {
      logger.error(error)
      if (error.response.status === 401) {
        logger.warn('ACCESS TOKEN EXPIRED');
        spotifyAuth.refreshToken(account.userId)
      }
    });
};
