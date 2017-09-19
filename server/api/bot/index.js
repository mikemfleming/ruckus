'use strict';

module.exports = (req, res) => {
  // figure out what the message says
  const message = req.body.event.text;

  // if it contains some kind of trigger
  if (spotifyTrack) {
    const trackId = /https:\/\/open.spotify.com\/track\/(.*)>/.exec(message)[1];
    console.log('spotify share', trackId)
  } else {
    console.log('random message', message)
  }
  res.end();
};
