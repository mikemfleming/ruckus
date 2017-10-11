'use strict';

const LocalStrategy = require('passport-local');

const User = require('../server/models/users');

module.exports = (passport) => {

  // user serialization
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });

  const localCallback = (req, email, password, done) => {
    process.nextTick(() => {
      User.findOne({ 'local.email': email }, (err, user) => {
        if (err) return done(err);
        if (user) {
          return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
        } else {
          const newUser = new User();
          newUser.local.email = email;
          newUser.local.password = newUser.generateHash(password);
          newUser.save((err) => {
            if (err) throw err;
            return done(null, newUser);
          });
        }
      });
    });
  };

  passport.use('local-signup', new LocalStrategy({ usernameField: 'email', passReqToCallback: true }, localCallback));
};
