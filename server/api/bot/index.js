'use strict';

module.exports = (req, res) => {
  const messageText = req.body.event.text;
  const spotifyTrack = /https:\/\/open.spotify.com\/track\/(.{22})>?/.exec(messageText);

  if (messageText && spotifyTrack) {
    console.log('someone shared a spotify link', spotifyTrack[1]);
  }

  res.end();
};
