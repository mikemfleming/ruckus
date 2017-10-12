'use strict';

const router = require('express').Router();

router.use('/local', require('./local'));
router.use('/spotify', require('./spotify'));

module.exports = router;
