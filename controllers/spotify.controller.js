'use strict';

const log = require('../logger');
const slack = require('../util/slack.util');
const spotifyAuth = require('../auth/spotify.auth');
const apiUtil = require('../util/api.util');

exports.addToPlaylist = function (trackId, account) {
console.log(account)
  // TODO: capture spotify user id and the playlist they want to add to
  const options = {
    url: 'https://api.spotify.com/v1/users/1228406874/playlists/4qIaLCTPEef0Zsy8G4deZz/tracks',
    method: 'post',
    params: { uris: `spotify:track:${trackId}` },
    headers: { 
      Authorization: 'Bearer ' + account.spotify.accessToken,
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  };

  return apiUtil.request(options)
    .then(() => log.info('ADDED TRACK'))
    .catch(retry);

  function retry (error) {
    log.error(error, 'ERROR ADDING TRACK');

    if (error.response && error.response.status && error. response.status === 401) {
      log.warn('ACCESS TOKEN EXPIRED');

      return spotifyAuth.refreshToken(account._id)
        .then(function (token) {
          log.info('REFRESHED TOKEN, TRYING AGAIN');
          
          options.headers.Authorization = 'Bearer ' + token;
          return apiUtil.request(options);
        });
    }
  }
};
