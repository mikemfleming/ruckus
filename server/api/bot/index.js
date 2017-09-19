'use strict';

module.exports = (req, res) => {
  const messageText = req.body.event.text;
  const spotifyTrack = /https:\/\/open.spotify.com\/track\/(.{22})>?/.exec(messageText);

  if (messageText) {
    if (spotifyTrack) {
      console.log('spotify share', spotifyTrack[1]);
    } else {
      console.log('random message', messageText);
    }
  }
  res.end();
};
