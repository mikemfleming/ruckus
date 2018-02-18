const log = require('../logger');
const apiUtil = require('../util/api.util');
const querystring = require('querystring');
const authUtil = require('../util/auth.util');
const { SPOTIFY, ENDPOINTS } = require('../config/main.config');
const Users = require('../models/users.model');
const Spotify = require('../controllers/spotify.controller');

const stateKey = 'spotify_auth_state'; // confirms req is from spotify

exports.authorize = (req, res) => {
  log.info('REDIRECTING TO SPOTIFY OAUTH');

  const state = authUtil.generateRandomString(16);
  const query = querystring.stringify({
    response_type: 'code',
    client_id: SPOTIFY.CLIENT_ID,
    scope: SPOTIFY.SCOPE,
    redirect_uri: ENDPOINTS.SPOTIFY.REDIRECT_URL,
    state,
  });

  res.cookie(stateKey, state);

  // request authorization from spotify
  res.redirect(`https://accounts.spotify.com/authorize?${query}`);
};

// TODO: get spotify user id and save it here
function getSpotifyTokens(authorizationCode, ruckusUserId) {
  log.info('GETTING SPOTIFY DETAILS');

  const options = {
    url: 'https://accounts.spotify.com/api/token',
    method: 'post',
    params: {
      code: authorizationCode,
      redirect_uri: ENDPOINTS.SPOTIFY.REDIRECT_URL,
      grant_type: 'authorization_code',
    },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(`${SPOTIFY.CLIENT_ID}:${SPOTIFY.CLIENT_SECRET}`).toString('base64')}`,
    },
  };

  return apiUtil.request(options)
    .then(data => Object.assign(data, ruckusUserId));
}

function getUserId(accessToken, ruckusUser) {
  const options = {
    url: 'https://api.spotify.com/v1/me',
    method: 'get',
    headers: { Authorization: `Bearer ${accessToken}` },
  };

  return apiUtil.request(options)
    .then(spotifyUser => ruckusUser.addSpotifyUserId(spotifyUser.id));
}

function createPlaylist(ruckusUser) {
  const { userId, accessToken } = ruckusUser.spotify;
  const options = {
    url: `https://api.spotify.com/v1/users/${userId}/playlists`,
    method: 'post',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    data: {
      name: 'Ruckus',
      public: true,
    },
  };
  return apiUtil.request(options)
    .then((response) => {
      const { id } = response;
      return ruckusUser.addSpotifyPlaylistId(id);
    });
}

function saveTokens(payload) {
  const accessToken = payload.access_token;
  const refreshToken = payload.refresh_token;

  if (!accessToken || !refreshToken) throw new Error('Tokens were not present in Spotify response.');

  return Users.findById(payload.ruckusUserId)
    .then((user) => {
      return user.addSpotifyTokens(accessToken, refreshToken)
        .then(user => getUserId(accessToken, user))
        .then(createPlaylist);
    });
}

exports.callback = (req, res) => {
  const ruckusUserId = req.session && req.session.passport ? req.session.passport.user : null;
  const { code, state } = req.query;
  const storedState = req.cookies ? req.cookies[stateKey] : null;

  if (!state || state !== storedState) {
    log.error('SPOTIFY STATE MISMATCH');
    res.redirect(`/#${querystring.stringify({ error: 'state_mismatch' })}`);
  } else {
    res.clearCookie(stateKey);

    getSpotifyTokens(code, { ruckusUserId })
      .then(saveTokens)
      .then(() => res.redirect(ENDPOINTS.PROFILE))
      .catch((error) => {
        log.error(error);
        res.redirect(`/#${querystring.stringify({ error: error.message })}`);
      });
  }
};

// send this as needed (when messages land)
exports.refreshToken = (_id) => {
  log.info('REFRESHING SPOTIFY TOKEN');

  return Users.findOne({ _id })
    .then((account) => {
      const options = {
        method: 'POST',
        url: 'https://accounts.spotify.com/api/token',
        headers: {
          Authorization: `Basic ${Buffer.from(`${SPOTIFY.CLIENT_ID}:${SPOTIFY.CLIENT_SECRET}`).toString('base64')}`,
        },
        params: {
          grant_type: 'refresh_token',
          refresh_token: account.spotify.refreshToken,
        },
        json: true,
      };

      return apiUtil.request(options)
        .then((data) => {
          const accessToken = data.access_token;
          return account.updateAccessToken(accessToken)
            .then(() => accessToken);
        })
        .catch(error => log.error(error));
    });
};
