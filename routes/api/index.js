const SlackBot = require('../../controllers/bot.controller');
const middleware = require('../middleware');

module.exports = (router) => {
  router.post('/bot', middleware.slack, SlackBot);
};
