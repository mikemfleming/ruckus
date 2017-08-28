'use strict';

const slack = require('../helpers/slack.util');

const spotify ={};

spotify.addToPlaylist = function(req, res) {
  // add track to playlist
    // success
    slack.sendOkStatus(req, res);
    // fail
    // slack.sendErrStatus(req, res);
};

module.exports = spotify;
