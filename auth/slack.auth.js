'use strict';

const log = require('../logger');

const querystring = require('querystring');
const axios = require('axios');

const apiUtil = require('../util/api.util');
const { SLACK, ENDPOINTS } = require('../config/main.config');
const authUtil = require('../util/auth.util');
const Users = require('../models/users.model');

const stateKey = 'slack_auth_state'; // confirms req is from slack

exports.authorize = function (req, res) {
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

exports.callback = function (req, res) {
    const ruckusUserId = req.session && req.session.passport ? req.session.passport.user : null;
    if (!ruckusUserId) throw new Error('RUCKUS USER ID NOT PRESENT IN SESSION');

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

            const options = {
                url: 'https://slack.com/api/oauth.access',
                method: 'GET',
                params: {
                    client_id: SLACK.CLIENT_ID,
                    client_secret: SLACK.CLIENT_SECRET,
                    code: authorization_code,
                    redirect_uri: ENDPOINTS.SLACK.REDIRECT_URL
                }
            };

            return apiUtil.request(options);
        }

        function saveTeam (data) {
            const slackTeamId = data.team ? data.team.id : null;
            const slackUserId = data.user ? data.user.id : null;
            console.log(data, slackUserId, slackTeamId)

            if (!slackTeamId || !slackUserId) throw new Error('IDs not present in Slack response.');

            return Users.captureSlackDetails({ ruckusUserId, slackTeamId, slackUserId });
        }

        function successRedirect () {
            log.info('REDIRECTING TO SPOTIFY OAUTH');
            res.redirect(ENDPOINTS.SPOTIFY.ROOT);
        }

        function failureRedirect (error) {
            log.error(error);
            const message = error.message || 'slack_callback_failed';
            res.redirect('/#' + querystring.stringify({ error: message }));
        }
    }
};
