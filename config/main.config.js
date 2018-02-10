module.exports = (() => {
  const { NODE_ENV, REDISTOGO_URL } = process.env;

  const PORT = process.env.PORT || 8888; // optionally set to heroku's default port

  const SESSION_SECRET = NODE_ENV === 'production'
    ? process.env.SESSION_SECRET_PROD
    : process.env.SESSION_SECRET_DEV;

  const MONGO_URL = NODE_ENV === 'production'
    ? process.env.MONGO_PROD_URL
    : process.env.MONGO_DEV_URL;

  const SLACK = {
    SCOPE: 'identity.basic',
    CLIENT_ID: process.env.SLACK_CLIENT_ID,
    CLIENT_SECRET: process.env.SLACK_CLIENT_SECRET,
    VERIFICATION_TOKEN: process.env.SLACK_VERIFICATION_TOKEN,
    BOT_TOKEN: process.env.SLACK_BOT_TOKEN,
  };

  const SPOTIFY = {
    SCOPE: 'playlist-modify-public',
    CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
    CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET,
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
      get REDIRECT_URL() {
        return NODE_ENV === 'production'
          ? `https://calm-crag-28252.herokuapp.com${this.CALLBACK}`
          : `http://localhost:${PORT + this.CALLBACK}`;
      },
    },
    SPOTIFY: {
      ROOT: '/authorize/spotify',
      REDIRECT: '/authorize/spotify/redirect',
      CALLBACK: '/authorize/spotify/callback',
      get REDIRECT_URL() {
        return NODE_ENV === 'production'
          ? `https://calm-crag-28252.herokuapp.com${this.CALLBACK}`
          : `http://localhost:${PORT + this.CALLBACK}`;
      },
      get ADD_TO_PLAYLIST() {
        return NODE_ENV === 'production'
          ? 'https://api.spotify.com/v1/users/1228406874/playlists/4qIaLCTPEef0Zsy8G4deZz/tracks'
          : 'https://api.spotify.com/v1/users/1228406874/playlists/6tEWZb7ys1UJvyjK3Gmxj4/tracks';
      },
    },
  };

  return {
    NODE_ENV,
    PORT,
    SESSION_SECRET,
    MONGO_URL,
    REDISTOGO_URL,
    SLACK,
    SPOTIFY,
    ENDPOINTS,
  };
})();
