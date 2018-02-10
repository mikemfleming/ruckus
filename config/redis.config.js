const { REDISTOGO_URL } = require('./main.config');
const url = require('url');
const redis = require('redis');

let redisClient;

if (REDISTOGO_URL) {
  const rtg = url.parse(REDISTOGO_URL);
  redisClient = redis.createClient(rtg.port, rtg.hostname);
  redisClient.auth(rtg.auth.split(':')[1]);
} else {
  redisClient = redis.createClient();
}

module.exports = redisClient;
