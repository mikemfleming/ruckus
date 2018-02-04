'use strict';

const tracks = require('../controllers/spotify.controller');
const SlackAccounts = require('../models/slackAccounts');
const SpotifyAccounts = require('../models/spotifyAccounts');

const logger = require('../logger');

module.exports = (req, res) => {
  const messageText = req.body.event.text;
  const teamId = req.body.team_id;
  const spotifyTrack = /https:\/\/open.spotify.com\/track\/(.{22})>?/.exec(messageText);

  if (messageText && spotifyTrack) {
    logger.info('MESSAGE MATCHED REGEX FOR SPOTIFY TRACK');

    const trackId = spotifyTrack[1];

    SlackAccounts.find({ teamId })
      .then((accounts) => {
        accounts.forEach((account) => {
          const userId = account.userId;

          SpotifyAccounts.findOne({ userId })
            .then((account) => {
              tracks.add(trackId, account)
            });

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
