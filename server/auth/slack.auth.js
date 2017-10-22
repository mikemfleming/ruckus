'use strict';

const querystring = require('querystring');
const axios = require('axios');

const config = require('../../config/main.config');
const authUtil = require('../util/auth.util');
const SlackAccounts = require('../models/slackAccounts');

const stateKey = 'slack_auth_state'; // confirms req is from slack

exports.authorize = (req, res) => {
    const state = authUtil.generateRandomString(16);
    const query = querystring.stringify({
      client_id: config.SLACK_CLIENT_ID,
      redirect_uri: config.SLACK_REDIRECT_URI,
      scope: config.SLACK_SCOPE,
      state: state,
    });

    res.cookie(stateKey, state);

    res.redirect(`https://slack.com/oauth/authorize?${query}`);
};

exports.callback = (req, res) => {
    const { code, state } = req.query;
    const storedState = req.cookies ? req.cookies[stateKey] : null;

    if (!state || state !== storedState) {
        res.redirect('/#' + querystring.stringify({ error: 'state_mismatch' }));
    } else {
        res.clearCookie(stateKey);

        getSlackDetails(code)
            .then(saveTeam)
            .then(successRedirect)
            .catch(failureRedirect);
        

        function getSlackDetails (authorization_code) {
            const params = {
                client_id: config.SLACK_CLIENT_ID,
                client_secret: config.SLACK_CLIENT_SECRET,
                code: authorization_code,
                redirect_uri: config.SLACK_REDIRECT_URI,
            };

            return axios.get('https://slack.com/api/oauth.access', { params });
        }

        function saveTeam (res) {
            const teamId = (res.data && res.data.team) ? res.data.team.id : null;
            const currentUserId = req.session.passport.user;
            if (!teamId) throw new Error('Team field not present in Slack response.');
            return SlackAccounts.addNewAccount(currentUserId, teamId);
        }

        function successRedirect () {
            res.redirect(config.AUTHORIZE_SPOTIFY_ROOT_URL);
        }

        function failureRedirect (error) {
            const message = error.message || 'slack_callback_failed';
            res.redirect('/#' + querystring.stringify({ error: message }));
        }
    }
};
