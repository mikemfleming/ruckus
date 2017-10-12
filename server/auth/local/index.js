'use strict';

const router = require('express').Router();
const passport = require('passport');
const appAuth = require('./local.auth');

const passportOptions = {
  successRedirect : '/auth/local/profile',
  failureRedirect : '/auth/local/signup',
  failureFlash : true,
};

router.get('/login', appAuth.login);
router.post('/login', passport.authenticate('local-login', passportOptions));

router.get('/signup', appAuth.signup);
router.post('/signup', passport.authenticate('local-signup', passportOptions));

router.get('/profile', appAuth.profile);
router.get('/logout', appAuth.logout);

module.exports = router;
