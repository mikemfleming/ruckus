'use strict';

const axios = require('axios');
const slack = require('../../util/slack.util');

exports.add = (trackId, account) => {

  const config = {
    url: 'https://api.spotify.com/v1/users/1228406874/playlists/4qIaLCTPEef0Zsy8G4deZz/tracks',
    method: 'post',
    headers: { 
      Authorization: 'Bearer ' + account.accessToken,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    params: {
      uris: `spotify:track:${trackId}`
    }
  };

  axios(config)
    .then(x => console.log('~~~~~~~~~~~~~~ added track'))
    .catch(y => console.log('~~~~~~~~~~~~~~ error', y.response.data.error.message))
};
