'use strict';

module.exports = (() => {
  const {
    SLACK_CLIENT_ID,
    SLACK_CLIENT_SECRET,
    SLACK_VERIFICATION_TOKEN,
    SLACK_BOT_TOKEN,
    SPOTIFY_CLIENT_ID,
    SPOTIFY_CLIENT_SECRET,
    ENVIRONMENT,
    SESSION_SECRET_DEV,
    SESSION_SECRET_PROD,
    MONGO_DEV_URL,
    MONGO_PROD_URL
  } = process.env;

  const LOG_LEVEL = ENVIRONMENT === 'development' ? 'dev' : 'common';

  const PORT = process.env.PORT || 8888; // optionally set to heroku's default port
  const REDIS_PORT = Number(PORT) + 1;

  const LOGIN_URL = '/login';
  const SIGNUP_URL = '/signup'
  const PROFILE_URL = '/profile';
  const LOGOUT_URL = '/logout';

  const SESSION_SECRET = ENVIRONMENT === 'development'
    ? SESSION_SECRET_DEV
    : SESSION_SECRET_PROD;

  const AUTHORIZE_ROOT_URL = '/authorize';

  const AUTHORIZE_SLACK_ROOT_URL = '/authorize/slack';
  const AUTHORIZE_SLACK_REDIRECT_URL = '/authorize/slack/redirect';
  const AUTHORIZE_SLACK_CALLBACK_URL = '/authorize/slack/callback';

  const AUTHORIZE_SPOTIFY_ROOT_URL = '/authorize/spotify';
  const AUTHORIZE_SPOTIFY_REDIRECT_URL = '/authorize/spotify/redirect';
  const AUTHORIZE_SPOTIFY_CALLBACK_URL = '/authorize/spotify/callback';

  const SPOTIFY_REDIRECT_URI = ENVIRONMENT === 'development'
    ? `http://localhost:${PORT + AUTHORIZE_SPOTIFY_CALLBACK_URL}`
    : `SPOTIFY PRODUCTION CALLBACK URL NOT SET`;

  const SLACK_REDIRECT_URI = ENVIRONMENT === 'development'
    ? `http://localhost:${PORT + AUTHORIZE_SLACK_CALLBACK_URL}`
    : `SLACK PRODUCTION CALLBACK URL NOT SET`;

  const SLACK_SCOPE = 'identity.basic';
  const SPOTIFY_SCOPE = 'playlist-modify-public';

  const MONGO_URL = ENVIRONMENT === 'development'
    ? MONGO_DEV_URL
    : MONGO_PROD_URL;

  return {
    SLACK_CLIENT_ID,
    SLACK_CLIENT_SECRET,
    SLACK_VERIFICATION_TOKEN,
    SLACK_BOT_TOKEN,
    SPOTIFY_CLIENT_ID,
    SPOTIFY_CLIENT_SECRET,
    ENVIRONMENT,
    SESSION_SECRET_DEV,
    SESSION_SECRET_PROD,
    MONGO_DEV_URL,
    MONGO_PROD_URL,

    LOG_LEVEL,

    PORT,
    REDIS_PORT,

    LOGIN_URL,
    SIGNUP_URL,
    PROFILE_URL,
    LOGOUT_URL,

    SESSION_SECRET,

    AUTHORIZE_ROOT_URL,

    AUTHORIZE_SLACK_ROOT_URL,
    AUTHORIZE_SLACK_REDIRECT_URL,
    AUTHORIZE_SLACK_CALLBACK_URL,

    AUTHORIZE_SPOTIFY_ROOT_URL,
    AUTHORIZE_SPOTIFY_REDIRECT_URL,
    AUTHORIZE_SPOTIFY_CALLBACK_URL,

    SPOTIFY_REDIRECT_URI,
    SLACK_REDIRECT_URI,

    SLACK_SCOPE,
    SPOTIFY_SCOPE,

    MONGO_URL,
  };
})();
