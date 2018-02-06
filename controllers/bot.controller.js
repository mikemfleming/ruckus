'use strict';

const tracks = require('./spotify.controller');
const Users = require('../models/users.model');

const logger = require('../logger');

module.exports = (req, res) => {
  const messageText = req.body.event.text;
  const teamId = req.body.team_id;
  const spotifyTrack = /https:\/\/open.spotify.com\/track\/(.{22})>?/.exec(messageText);

  if (messageText && spotifyTrack) {
    logger.info('MESSAGE MATCHED REGEX FOR SPOTIFY TRACK');

    const trackId = spotifyTrack[1];

    Users.find({ 'slack.teamId': teamId })
      .then((accounts) => {
        if (!accounts) throw new Error(`FAILED TO FIND SLACK TEAM MEMBERS: ${teamId}`);

        accounts.forEach((account) => {
          tracks.add(trackId, account);
        });
      })

  }

  // no reason to respond with data to slack at this time so end res 
  res.end();
};

/*'use strict';

const router = require('express').Router();
const middleware = require('../middleware');

// API specific middleware
router.use(middleware.filter);
router.use(middleware.isAuthorized);

router.use('/bot', require('./bot'));

module.exports = router;
*/
