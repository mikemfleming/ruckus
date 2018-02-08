'use strict';

const Spotify = require('./spotify.controller');
const Users = require('../models/users.model');
const log = require('../logger');

module.exports = function (req, res) {
  const { team_id } = req.body;
  const { text } = req.body.event;
  const trackId = /https:\/\/open.spotify.com\/track\/(.{22})>?/.exec(text)[1];

  if (text && trackId) {
    log.info('MESSAGE MATCHED REGEX FOR SPOTIFY TRACK');
    Users.getSlackMembers(team_id)
      .then(addToPlaylists(trackId))
      .catch((error) => log.error(error, 'ERROR ADDING TRACK TO MEMBER PLAYLISTS'));
  }

  return res.end();

  function addToPlaylists (trackId) {
    return (members) => {
      return Promise.all(members.map((account) => Spotify.addToPlaylist(trackId, account)));
    }
  }
};
