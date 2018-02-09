'use strict';
const logger = require('../../logger');

exports.home = (req, res) => {
	logger.info('RENDERING HOME PAGE');
	res.render('index.ejs');
};

exports.login = (req, res) => {
  logger.info('RENDERING LOGIN PAGE');
  res.render('login.ejs', { message: req.flash('loginMessage') });
};

exports.signup = (req, res) => {
	logger.info('RENDERING SIGNUP PAGE');
  res.render('signup.ejs', { message: req.flash('signupMessage') });
};

exports.profile = (req, res) => {
	logger.info('RENDERING PROFILE PAGE');
  res.render('profile.ejs', { user: req.user });
};

exports.logout = (req, res) => {
	logger.info('LOGGING OUT');
  req.logout();
  res.redirect('/');
};