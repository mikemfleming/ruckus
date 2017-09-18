'use strict';

const router = require('express').Router();

router.use('/spotify', require('./spotify'));

module.exports = router;
