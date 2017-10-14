'use strict';

const LocalStrategy = require('passport-local');
const SlackStrategy = require('passport-slack').Strategy;

const User = require('../server/models/users');
const config = require('./main.config');

module.exports = (passport) => {

  passport.serializeUser(serializeUser);
  passport.deserializeUser(deserializeUser);

  passport.use('local-signup', new LocalStrategy({ usernameField: 'username', passReqToCallback: true }, localSignupCallback));
  passport.use('local-login', new LocalStrategy({ usernameField: 'username', passReqToCallback: true }, localLoginCallback));

  function serializeUser (user, done) {
    done(null, user.id);
  }

  function deserializeUser (id, done) {
    User.findById(id, (err, user) => done(err, user));
  }

  function localSignupCallback (req, username, password, done) {
    process.nextTick(() => {
      User.findOne({ 'username': username }, (err, user) => {
        if (err) return done(err);
        if (user) return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
        const newUser = new User();
        newUser.username = username;
        newUser.password = newUser.generateHash(password);
        newUser.save((err) => {
          if (err) throw err;
          return done(null, newUser);
        });
      });
    });
  };

  function localLoginCallback (req, username, password, done) {
    User.findOne({ username: username }, (err, user) => {
      if (err) return done(err);
      if (!user) return done(null, false, req.flash('loginMessage', 'No user found.'));
      return done(null, user);
    });
  };
};
