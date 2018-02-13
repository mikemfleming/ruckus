const Spotify = require('./spotify.controller');
const Users = require('../models/users.model');
const log = require('../logger');

module.exports = (req, res) => {
  const teamId = req.body.team_id;
  const { text } = req.body.event;
  const trackId = /https:\/\/open.spotify.com\/track\/(.{22})>?/.exec(text)[1];

  function addToPlaylists(track) {
    return (members) => {
      Promise.all(members.map(account => Spotify.addToPlaylist(track, account)));
    };
  }

  if (text && trackId) {
    log.info('MESSAGE MATCHED REGEX FOR SPOTIFY TRACK');
    Users.getSlackMembers(teamId)
      .then(addToPlaylists(trackId))
      .catch(error => log.error(error, 'ERROR ADDING TRACK TO MEMBER PLAYLISTS'));
  }

  return res.end();
};
