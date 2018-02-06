'use strict';

const { ENDPOINTS } = require('../../config/main.config');
const SlackBot = require('../../controllers/bot.controller');
const middleware = require('../middleware');

module.exports = function (router) {
	router.post('/bot', middleware.slack, SlackBot);
};
