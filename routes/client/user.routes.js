const log = require('../../logger');
const path = require('path');

exports.home = (req, res) => {
  log.info('RENDERING HOME PAGE');
  res.render('index.ejs');
};

exports.login = (req, res) => {
  log.info('RENDERING LOGIN PAGE');
  res.render('login.ejs', { message: req.flash('loginMessage') });
};

exports.signup = (req, res) => {
  log.info('RENDERING SIGNUP PAGE');
  res.render('signup.ejs', { message: req.flash('signupMessage') });
};

exports.profile = (req, res) => {
  log.info('RENDERING PROFILE PAGE');
  res.sendFile(path.join(__dirname, '../../index.html'));
  // res.render('profile.ejs', { user: req.user });
};

exports.logout = (req, res) => {
  log.info('LOGGING OUT');
  req.logout();
  res.redirect('/');
};
