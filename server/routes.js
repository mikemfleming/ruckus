'use strict';

const passport = require('passport');

const localAuth = require('./auth/local.auth');
const slackAuth = require('./auth/slack.auth');
const middleware = require('./middleware');

module.exports = function (app) {

	const passportOptions = {
	  successRedirect : '/profile',
	  failureRedirect : '/signup',
	  failureFlash : true,
	};

	app.get('/', (req, res) => res.render('index.ejs'));

	app.get('/login', localAuth.login);
	app.post('/login', passport.authenticate('local-login', passportOptions));

	app.get('/signup', localAuth.signup);
	app.post('/signup', passport.authenticate('local-signup', passportOptions));

	app.get('/profile', middleware.isLoggedIn, localAuth.profile);
	app.get('/logout', localAuth.logout);

	app.get('/authorize', middleware.isLoggedIn, localAuth.authorize);
	app.get('/authorize/slack', passport.authorize('slack'));
	app.get('/authorize/slack/callback', passport.authorize('slack', { failureRedirect: '/login' }), slackAuth.callback);
};
