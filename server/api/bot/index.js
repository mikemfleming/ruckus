'use strict';

const tracks = require('../../models/spotify');

module.exports = (req, res) => {
  const messageText = req.body.event.text;
  const spotifyTrack = /https:\/\/open.spotify.com\/track\/(.{22})>?/.exec(messageText);

  console.log('~~~~~~~~~~~ caught a message', messageText);

  if (messageText && spotifyTrack) {
    const trackId = spotifyTrack[1];
    console.log('~~~~~~~~~~~~~~~ caught a track', trackId);
  }

  res.end();
};
