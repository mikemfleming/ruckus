const log = require('../logger');
const spotifyAuth = require('../auth/spotify.auth');
const apiUtil = require('../util/api.util');
const { ENDPOINTS } = require('../config/main.config');

exports.addToPlaylist = (trackId, account) => {
  const options = {
    url: ENDPOINTS.SPOTIFY.ADD_TO_PLAYLIST,
    method: 'post',
    params: { uris: `spotify:track:${trackId}` },
    headers: {
      Authorization: `Bearer ${account.spotify.accessToken}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  };

  return apiUtil.request(options)
    .then(() => log.info('ADDED TRACK'))
    .catch((error) => {
      if (error.response && error.response.status && error.response.status === 401) {
        log.warn('ACCESS TOKEN EXPIRED');
        const ruckusUserId = account._id;
        return spotifyAuth.refreshToken(ruckusUserId)
          .then((token) => {
            log.info('REFRESHED TOKEN, TRYING AGAIN');
            options.headers.Authorization = `Bearer ${token}`;
            log.info(options)
            return apiUtil.request(options);
          });
      }
      log.error(error.response.data, 'ERROR ADDING TRACK');
      throw error;
    });
};

exports.getUserId = (accessToken) => {
  const options = {
    url: 'https://api.spotify.com/v1/me',
    method: 'get',
    headers: { Authorization: `Bearer ${accessToken}` },
  };

  return apiUtil.request(options)
    .then(console.log)
    .catch(log.error);
};
