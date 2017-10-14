'use strict';

const querystring = require('querystring');

const config = require('../../config/main.config');
const authUtil = require('../helpers/auth.util');

exports.authorize = (req, res) => {
    const stateKey = 'slack_auth_state';
    const state = authUtil.generateRandomString(16);

    res.cookie(stateKey, state);

    res.redirect('https://slack.com/oauth/authorize?' +
        querystring.stringify({
          client_id: config.SLACK_CLIENT_ID,
          redirect_uri: 'http://localhost:8888/authorize/slack/callback', // add SLACK_REDIRECT_URI to .env
          scope: 'identity.basic', // add SLACK_SCOPE to .env
          state: state,
        }));
};

exports.callback = (req, res) => {
    res.redirect('/thisShitIsWorking')
};
