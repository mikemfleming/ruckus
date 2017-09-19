'use strict';

module.exports = (() => {
  const LOG_LEVEL = process.env.LOG_LEVEL || 'production';
  const PORT = process.env.PORT || 8888;
  const SLACK_CLIENT_ID = process.env.SLACK_CLIENT_ID;
  const SLACK_CLIENT_SECRET = process.env.SLACK_CLIENT_SECRET;
  const SLACK_VERIFICATION_TOKEN = process.env.SLACK_VERIFICATION_TOKEN;
  const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;
  const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
  const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
  const SPOTIFY_REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI;
  const MONGO_URL = process.env.MONGO_URL;
  const SESSION_SECRET = process.env.SESSION_SECRET;

  return {
    LOG_LEVEL,
    PORT,
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
