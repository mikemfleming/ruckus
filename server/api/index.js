'use strict';

const router = require('express').Router();
const middleware = require('../middleware');

// API specific middleware
router.use(middleware.filter);
router.use(middleware.isAuthorized);

router.use('/bot', require('./bot'));

module.exports = router;
