'use strict';

const router = require('express').Router();
const middleware = require('../middleware');

router.use('/spotify', require('./spotify'));

module.exports = router;
