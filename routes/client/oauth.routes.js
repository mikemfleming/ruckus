'use strict';
const logger = require('../../logger');

exports.authorizeSlack = (req, res) => {
	logger.info('RENDERING SLACK AUTHORIZATION PAGE');
	res.render('slack.ejs');
};

exports.authorizeSpotify = (req, res) => {
	logger.info('RENDERING SPOTIFY AUTHORIZATION PAGE');
	res.render('spotify.ejs');
};
