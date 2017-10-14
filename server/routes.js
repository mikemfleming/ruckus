'use strict';

const passport = require('passport');

const localAuth= require('./auth/local.auth');

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

	app.get('/profile', localAuth.profile);
	app.get('/logout', localAuth.logout);
};
