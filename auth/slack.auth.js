const log = require('../logger');
const querystring = require('querystring');
const apiUtil = require('../util/api.util');
const { SLACK, ENDPOINTS } = require('../config/main.config');
const authUtil = require('../util/auth.util');
const Users = require('../models/users.model');

const stateKey = 'slack_auth_state'; // confirms req is from slack

exports.authorize = (req, res) => {
  log.info('REDIRECTING TO SLACK OAUTH');

  const state = authUtil.generateRandomString(16);
  const query = querystring.stringify({
    client_id: SLACK.CLIENT_ID,
    redirect_uri: ENDPOINTS.SLACK.REDIRECT_URL,
    scope: SLACK.SCOPE,
    state,
  });

  res.cookie(stateKey, state);

  res.redirect(`https://slack.com/oauth/authorize?${query}`);
};

function getSlackDetails(authorizationCode, ruckusUserId) {
  log.info('GETTING SLACK DETAILS');

  const options = {
    url: 'https://slack.com/api/oauth.access',
    method: 'GET',
    params: {
      client_id: SLACK.CLIENT_ID,
      client_secret: SLACK.CLIENT_SECRET,
      code: authorizationCode,
      redirect_uri: ENDPOINTS.SLACK.REDIRECT_URL,
    },
  };

  return apiUtil.request(options)
    .then(data => Object.assign(data, ruckusUserId));
}

function saveTeam(payload) {
  const slackTeamId = payload.team ? payload.team.id : null;
  const slackUserId = payload.user ? payload.user.id : null;

  if (!slackTeamId || !slackUserId) throw new Error('IDs not present in Slack response.');

  return Users.findById(payload.ruckusUserId)
    .then(account => account.addSlackDetails(slackUserId, slackTeamId));
}

exports.callback = (req, res) => {
  const { code, state } = req.query;
  const storedState = req.cookies ? req.cookies[stateKey] : null;
  const ruckusUserId = req.session && req.session.passport ? req.session.passport.user : null;

  if (!state || state !== storedState) {
    log.error(req, 'SLACK STATE MISMATCH');
    res.redirect(`/#${querystring.stringify({ error: 'state_mismatch' })}`);
  } else {
    res.clearCookie(stateKey);

    getSlackDetails(code, { ruckusUserId })
      .then(saveTeam)
      .then(() => res.redirect(ENDPOINTS.PROFILE))
      .catch((error) => {
        log.error(error);
        res.redirect(`/#${querystring.stringify({ error: error.message })}`);
      });
  }
};
