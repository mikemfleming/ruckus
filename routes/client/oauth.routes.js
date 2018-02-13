const log = require('../../logger');

exports.authorizeSlack = (req, res) => {
  log.info('RENDERING SLACK AUTHORIZATION PAGE');
  res.render('slack.ejs');
};

exports.authorizeSpotify = (req, res) => {
  log.info('RENDERING SPOTIFY AUTHORIZATION PAGE');
  res.render('spotify.ejs');
};
