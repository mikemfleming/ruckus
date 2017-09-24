'use strict';

const router = require('express').Router();
const passport = require('passport');
const appAuth = require('./app.auth');

const passportOptions = {
  successRedirect : '/auth/app/profile',
  failureRedirect : '/auth/app/signup',
  failureFlash : true,
};

router.get('/login', appAuth.login);
router.get('/signup', appAuth.signup);
router.post('/signup', passport.authenticate('local-signup', passportOptions)); // pretty sure there is an issue with the order in which passport is configured...
router.get('/profile', appAuth.profile);
router.get('logout', appAuth.logout);

module.exports = router;
