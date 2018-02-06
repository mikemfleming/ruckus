'use strict';

const log = require('../logger');

const querystring = require('querystring');
const axios = require('axios');

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
      state: state,
    });

    res.cookie(stateKey, state);

    res.redirect(`https://slack.com/oauth/authorize?${query}`);
};

exports.callback = (req, res) => {
    const { code, state } = req.query;
    const storedState = req.cookies ? req.cookies[stateKey] : null;
    if (!state || state !== storedState) {
        log.error(req, 'SLACK STATE MISMATCH');
        res.redirect('/#' + querystring.stringify({ error: 'state_mismatch' }));
    } else {
        res.clearCookie(stateKey);

        getSlackDetails(code)
            .then(saveTeam)
            .then(successRedirect)
            .catch(failureRedirect);
        

        function getSlackDetails (authorization_code) {
            log.info('GETTING SLACK DETAILS');
            
            const params = {
                client_id: SLACK.CLIENT_ID,
                client_secret: SLACK.CLIENT_SECRET,
                code: authorization_code,
                redirect_uri: ENDPOINTS.SLACK.REDIRECT_URL
            };

            return axios.get('https://slack.com/api/oauth.access', { params });
        }

        function saveTeam (res) {
            const teamId = (res.data && res.data.team) ? res.data.team.id : null;
            const _id = req.session.passport.user;
            if (!teamId) throw new Error('Team field not present in Slack response.');
            return Users.update({ _id }, { $set: { 'slack.teamId': teamId } })
                .then(() => log.info('UPDATED USER WITH SLACK TEAM'));
        }

        function successRedirect () {
            log.info('REDIRECTING TO SPOTIFY OAUTH');
            res.redirect(ENDPOINTS.SPOTIFY.ROOT);
        }

        function failureRedirect (error) {
            const message = error.message || 'slack_callback_failed';
            log.error(message);
            res.redirect('/#' + querystring.stringify({ error: message }));
        }
    }
};
