'use strict';

const router = require('express').Router();
const util = require('../helpers/api.util');

router.use(util.isAuthorized);

router.use('/spotify', require('./spotify'));

module.exports = router;
