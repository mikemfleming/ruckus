'use strict';

const passport = require('passport');

const localAuth = require('./auth/local.auth');
const slackAuth = require('./auth/slack.auth');
const spotifyAuth = require('./auth/spotify.auth');
const middleware = require('./middleware');
const config = require('../config/main.config');

module.exports = function (app) {

	const passportOptions = {
	  successRedirect : config.PROFILE_URL,
	  failureRedirect : config.LOGOUT_URL,
	  failureFlash : true,
	};

	app.get('/', (req, res) => res.render('index.ejs'));

	app.get(config.LOGIN_URL, localAuth.login);
	app.post(config.LOGIN_URL, passport.authenticate('local-login', passportOptions));

	app.get(config.SIGNUP_URL, localAuth.signup);
	app.post(config.SIGNUP_URL, passport.authenticate('local-signup', passportOptions));

	app.get(config.PROFILE_URL, middleware.isLoggedIn, localAuth.profile);

	app.get(config.LOGOUT_URL, localAuth.logout);

	app.get(config.AUTHORIZE_ROOT_URL, middleware.isLoggedIn, localAuth.authorize);
	app.get(config.AUTHORIZE_SLACK_ROOT_URL, middleware.isLoggedIn, slackAuth.authorize);
	app.get(config.AUTHORIZE_SLACK_CALLBACK_URL, middleware.isLoggedIn, slackAuth.callback);

	app.get(config.AUTHORIZE_SPOTIFY_ROOT_URL, middleware.isLoggedIn, spotifyAuth.authorize);
	app.get(config.AUTHORIZE_SPOTIFY_CALLBACK_URL, middleware.isLoggedIn, spotifyAuth.callback);
};
