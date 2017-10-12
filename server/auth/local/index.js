'use strict';

const router = require('express').Router();
const passport = require('passport');
const localAuth = require('./local.auth');

const passportOptions = {
  successRedirect : '/auth/local/profile',
  failureRedirect : '/auth/local/signup',
  failureFlash : true,
};

router.get('/login', localAuth.login);
router.post('/login', passport.authenticate('local-login', passportOptions));

router.get('/signup', localAuth.signup);
router.post('/signup', passport.authenticate('local-signup', passportOptions));

router.get('/profile', localAuth.profile);
router.get('/logout', localAuth.logout);

module.exports = router;
