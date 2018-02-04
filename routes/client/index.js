'use strict';

const passport = require('passport');

const User = require('./user.routes');
const Oauth = require('./oauth.routes');

const SlackAuth = require('../../auth/slack.auth');
const SpotifyAuth = require('../../auth/spotify.auth');
const middleware = require('../middleware');
const { ENDPOINTS } = require('../../config/main.config');


module.exports = function (app) {
	const passportOptions = {
	  successRedirect : ENDPOINTS.PROFILE,
	  failureRedirect : ENDPOINTS.LOGOUT,
	  failureFlash : true,
	};

	// views
	app.get('/', User.home);
	app.get(ENDPOINTS.LOGIN, User.login);
	app.post(ENDPOINTS.LOGIN, passport.authenticate('local-login', passportOptions));

	app.get(ENDPOINTS.SIGNUP, User.signup);
	app.post(ENDPOINTS.SIGNUP, passport.authenticate('local-signup', passportOptions));

	app.get(ENDPOINTS.PROFILE, middleware.isLoggedIn, User.profile);
	app.get(ENDPOINTS.LOGOUT, User.logout);

	// slack oauth
	app.get(ENDPOINTS.SLACK.ROOT, middleware.isLoggedIn, Oauth.authorizeSlack);
	app.get(ENDPOINTS.SLACK.REDIRECT, middleware.isLoggedIn, SlackAuth.authorize);
	app.get(ENDPOINTS.SLACK.CALLBACK, middleware.isLoggedIn, SlackAuth.callback);

	// spotify oauth
	app.get(ENDPOINTS.SPOTIFY.ROOT, middleware.isLoggedIn, Oauth.authorizeSpotify);
	app.get(ENDPOINTS.SPOTIFY.REDIRECT, middleware.isLoggedIn, SpotifyAuth.authorize);
	app.get(ENDPOINTS.SPOTIFY.CALLBACK, middleware.isLoggedIn, SpotifyAuth.callback);
};
