'use strict';

const router = require('express').Router();

router.use('/app', require('./app'));
router.use('/spotify', require('./spotify'));

module.exports = router;
