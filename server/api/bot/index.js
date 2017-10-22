'use strict';

const tracks = require('../../models/spotify');
const User = require('../../models/users');

module.exports = (req, res) => {
  const messageText = req.body.event.text;
  const spotifyTrack = /https:\/\/open.spotify.com\/track\/(.{22})>?/.exec(messageText);

  console.log('~~~~~~~~~~~ caught a message', messageText);

  if (messageText && spotifyTrack) {
    const trackId = spotifyTrack[1];

    // a track is shared in one team

    // for each user on that slack team

    // add that track to that user's spotify playlist

  }

  res.end();
};
