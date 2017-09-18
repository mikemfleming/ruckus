'use strict';

const router = require('express').Router();
const apiUtil = require('../helpers/api.util');
const slackUtil = require('../helpers/slack.util');

router.use(apiUtil.isAuthorized);
router.use(slackUtil.challenge);

router.use('/spotify', require('./spotify'));

module.exports = router;
