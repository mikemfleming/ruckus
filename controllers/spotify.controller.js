const log = require('../logger');
const spotifyAuth = require('../auth/spotify.auth');
const apiUtil = require('../util/api.util');
const { ENDPOINTS } = require('../config/main.config');

exports.addToPlaylist = (trackId, account) => {
  // TODO: capture spotify user id and the playlist they want to add to
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
            return apiUtil.request(options);
          });
      }
      log.error(error.response.data, 'ERROR ADDING TRACK');
      throw error;
    });
};
