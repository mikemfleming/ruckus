'use strict';

const passport = require('passport');

const localAuth = require('./auth/local.auth');
const slackAuth = require('./auth/slack.auth');
const spotifyAuth = require('./auth/spotify.auth');
const middleware = require('./middleware');
const { ENDPOINTS } = require('../config/main.config');
const api = require('./api');

module.exports = function (app) {

	const passportOptions = {
	  successRedirect : ENDPOINTS.PROFILE,
	  failureRedirect : ENDPOINTS.LOGOUT,
	  failureFlash : true,
	};

	// views
	app.get('/', localAuth.home);
	app.get(ENDPOINTS.LOGIN, localAuth.login);
	app.post(ENDPOINTS.LOGIN, passport.authenticate('local-login', passportOptions));

	app.get(ENDPOINTS.SIGNUP, localAuth.signup);
	app.post(ENDPOINTS.SIGNUP, passport.authenticate('local-signup', passportOptions));

	app.get(ENDPOINTS.PROFILE, middleware.isLoggedIn, localAuth.profile);
	app.get(ENDPOINTS.LOGOUT, localAuth.logout);

	// slack oauth
	app.get(ENDPOINTS.SLACK.ROOT, middleware.isLoggedIn, localAuth.authorizeSlack);
	app.get(ENDPOINTS.SLACK.REDIRECT, middleware.isLoggedIn, slackAuth.authorize);
	app.get(ENDPOINTS.SLACK.CALLBACK, middleware.isLoggedIn, slackAuth.callback);

	// spotify oauth
	app.get(ENDPOINTS.SPOTIFY.ROOT, middleware.isLoggedIn, localAuth.authorizeSpotify);
	app.get(ENDPOINTS.SPOTIFY.REDIRECT, middleware.isLoggedIn, spotifyAuth.authorize);
	app.get(ENDPOINTS.SPOTIFY.CALLBACK, middleware.isLoggedIn, spotifyAuth.callback);

	// api
	app.use(ENDPOINTS.API, api);
};
