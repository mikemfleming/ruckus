const log = require('../../logger');

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
  res.render('profile.ejs', { user: req.user });
};

exports.logout = (req, res) => {
  log.info('LOGGING OUT');
  req.logout();
  res.redirect('/');
};
