'use strict';

module.exports = (() => {
  const NODE_ENV = process.env.NODE_ENV || 'development';
  const PORT = process.env.PORT || 8888;
  const SLACK_CLIENT_ID = process.env.SLACK_CLIENT_ID;
  const SLACK_CLIENT_SECRET = process.env.SLACK_CLIENT_SECRET;
  const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
  const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
  const SPOTIFY_REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI;
  const MONGO_URL = process.env.MONGO_URL;

  return {
    NODE_ENV,
    PORT,
    SLACK_CLIENT_ID,
    SLACK_CLIENT_SECRET,
    SPOTIFY_CLIENT_ID,
    SPOTIFY_CLIENT_SECRET,
    SPOTIFY_REDIRECT_URI,
    MONGO_URL,
  };
})();
