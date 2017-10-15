'use strict';

module.exports = (() => {
  const LOG_LEVEL = process.env.LOG_LEVEL || 'production';
  const PORT = process.env.PORT || 8888;

  const LOGIN_URL = '/login';
  const SIGNUP_URL = '/signup'
  const PROFILE_URL = '/profile';
  const LOGOUT_URL = '/logout';

  const AUTHORIZE_ROOT_URL = '/authorize';
  const AUTHORIZE_SLACK_ROOT_URL = '/authorize/slack';
  const AUTHORIZE_SLACK_CALLBACK_URL = '/authorize/slack/callback';
  const AUTHORIZE_SPOTIFY_ROOT_URL = '/authorize/spotify';
  const AUTHORIZE_SPOTIFY_CALLBACK_URL = '/authorize/spotify/callback';

  const {
    SLACK_CLIENT_ID,
    SLACK_CLIENT_SECRET,
    SLACK_VERIFICATION_TOKEN,
    SLACK_BOT_TOKEN,
    SPOTIFY_CLIENT_ID,
    SPOTIFY_CLIENT_SECRET,
    SPOTIFY_REDIRECT_URI,
    MONGO_URL,
    SESSION_SECRET
  } = process.env;

  console.log(process.env.MONGO_URL)

  return {
    LOG_LEVEL,
    PORT,

    LOGIN_URL,
    SIGNUP_URL,
    PROFILE_URL,
    LOGOUT_URL,

    AUTHORIZE_ROOT_URL,
    AUTHORIZE_SLACK_ROOT_URL,
    AUTHORIZE_SLACK_CALLBACK_URL,
    AUTHORIZE_SPOTIFY_ROOT_URL,
    AUTHORIZE_SPOTIFY_CALLBACK_URL,

    SLACK_CLIENT_ID,
    SLACK_CLIENT_SECRET,
    SLACK_VERIFICATION_TOKEN,
    SLACK_BOT_TOKEN,
    SPOTIFY_CLIENT_ID,
    SPOTIFY_CLIENT_SECRET,
    SPOTIFY_REDIRECT_URI,
    MONGO_URL,
    SESSION_SECRET,
  };
})();
