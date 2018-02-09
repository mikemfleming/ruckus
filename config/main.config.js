'use strict';

module.exports = (() => {
  const { ENVIRONMENT } = process.env;

  const PORT = process.env.PORT || 8888; // optionally set to heroku's default port
  const REDIS_PORT = Number(PORT) + 1;

  const LOG_LEVEL = ENVIRONMENT === 'development'
    ? 'dev'
    : 'common';

  const SESSION_SECRET = ENVIRONMENT === 'development'
    ? process.env.SESSION_SECRET_DEV
    : process.env.SESSION_SECRET_PROD;

  const MONGO_URL = ENVIRONMENT === 'development'
    ? process.env.MONGO_DEV_URL
    : process.env.MONGO_PROD_URL;

  const SLACK = {
    SCOPE: 'identity.basic',
    CLIENT_ID: process.env.SLACK_CLIENT_ID,
    CLIENT_SECRET: process.env.SLACK_CLIENT_SECRET,
    VERIFICATION_TOKEN: process.env.SLACK_VERIFICATION_TOKEN,
    BOT_TOKEN: process.env.SLACK_BOT_TOKEN
  };

  const SPOTIFY = {
    SCOPE: 'playlist-modify-public',
    CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
    CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET
  };

  const ENDPOINTS = {
    LOGIN: '/login',
    SIGNUP: '/signup',
    PROFILE: '/profile',
    LOGOUT: '/logout',
    AUTHORIZE: '/authorize',
    API: '/api',
    SLACK: {
      ROOT: '/authorize/slack',
      REDIRECT: '/authorize/slack/redirect',
      CALLBACK: '/authorize/slack/callback',
      get REDIRECT_URL () {
        return ENVIRONMENT === 'development'
          ? `http://localhost:${PORT + this.CALLBACK}`
          : ' SLACK REDIRECT NOT SET FOR PROD'
      }
    },
    SPOTIFY: {
      ROOT: '/authorize/spotify',
      REDIRECT: '/authorize/spotify/redirect',
      CALLBACK: '/authorize/spotify/callback',
      get REDIRECT_URL () {
        return ENVIRONMENT === 'development'
          ? `http://localhost:${PORT + this.CALLBACK}`
          : ' SPOTIFY REDIRECT NOT SET FOR PROD'
      }
    }
  };

  return {
    ENVIRONMENT,
    LOG_LEVEL,
    PORT,
    REDIS_PORT,
    SESSION_SECRET,
    MONGO_URL,

    SLACK,

    SPOTIFY,

    ENDPOINTS
  };
})();
