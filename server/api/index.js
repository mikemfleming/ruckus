'use strict';

const router = require('express').Router();
const middleware = require('../middleware');

// API specific middleware
router.use(middleware.spy);
router.use(middleware.isAuthorized);
router.use(middleware.challenge);

router.use('/spotify', require('./spotify'));
router.use('/bot', require('./bot'));

module.exports = router;
