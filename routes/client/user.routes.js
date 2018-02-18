const log = require('../../logger');
const Users = require('../../models/users.model');

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
  const { _id } = req.user;
  Users.findById(_id)
    .then((user) => {
      const slackEnabled = !!user.slack;
      const spotifyEnabled = !!user.spotify;

      if (!slackEnabled) log.info('PROMPTING USER TO ENABLED SLACK');
      if (!spotifyEnabled) log.info('PROMPTING USER TO ENABLE SPOTIFY');

      res.render('profile.ejs', { user, spotifyEnabled, slackEnabled });
    });
};

exports.logout = (req, res) => {
  log.info('LOGGING OUT');
  req.logout();
  res.redirect('/');
};
