'use strict';

exports.login = (req, res) => {
  res.render('login.ejs', { message: req.flash('loginMessage') });
};

exports.signup = (req, res) => {
  res.render('signup.ejs', { message: req.flash('signupMessage') });
};

exports.profile = (req, res) => {
  res.render('profile.ejs', { user: req.user });
};

exports.logout = (req, res) => {
  req.logout();
  res.redirect('/');
};

exports.authorize = (req, res) => {
	res.render('authorize.ejs');
};
