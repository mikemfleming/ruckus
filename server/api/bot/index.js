'use strict';

const tracks = require('../../models/spotify');
const SlackAccounts = require('../../models/slackAccounts');
const SpotifyAccounts = require('../../models/spotifyAccounts');

module.exports = (req, res) => {
  const messageText = req.body.event.text;
  const teamId = req.body.team_id;
  const spotifyTrack = /https:\/\/open.spotify.com\/track\/(.{22})>?/.exec(messageText);

  console.log('~~~~~~~~~~~ caught a message', messageText);

  if (messageText && spotifyTrack) {
    const trackId = spotifyTrack[1];

    console.log('~~~~~~~~~~~ caught a track', trackId);

    SlackAccounts.find({ teamId })
      .then((accounts) => {
        accounts.forEach((account) => {
          const userId = account.userId;

          SpotifyAccounts.findOne({ userId })
            .then((account) => {
              // send track to this accounts spotify playlist
              tracks.add(trackId, account)
            });

        });
      })

  }

  res.end();
};
