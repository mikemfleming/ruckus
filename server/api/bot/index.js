'use strict';

module.exports = (req, res) => {
  // figure out what the message says
  const message = req.body.event.text;
  const spotifyTrack = /https:\/\/open.spotify.com\/track\/(.{22})>?/.exec(message);
  // if it contains some kind of trigger
  if (spotifyTrack) {
    console.log('spotify share', spotifyTrack[1]);
  } else {
    console.log('random message', message);
  }
  res.end();
};
