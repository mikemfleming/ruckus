'use strict';

module.exports = (req, res) => {
  // figure out what the message says
  const message = req.body.event.text;
  const spotifyTrack = /https:\/\/open.spotify.com\/track\//.test(message)

  // if it contains some kind of trigger
  if (spotifyTrack) {
    const trackId = /https:\/\/open.spotify.com\/track\/(.*)>/.exec(message)[1];
    console.log('spotify share', trackId)
  } else {
    console.log('random message', message)
  }
  res.end();
};
