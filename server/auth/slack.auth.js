'use strict';

const querystring = require('querystring');
const axios = require('axios');

const config = require('../../config/main.config');
const authUtil = require('../helpers/auth.util');
const User = require('../models/users');

const stateKey = 'slack_auth_state'; // confirms req is from slack

exports.authorize = (req, res) => {
    const state = authUtil.generateRandomString(16);
    const query = querystring.stringify({
      client_id: config.SLACK_CLIENT_ID,
      redirect_uri: 'http://localhost:8888/authorize/slack/callback', // #addToConfig
      scope: 'identity.basic', // #addToConfig
      state: state,
    });

    res.cookie(stateKey, state); // #addToConfig

    res.redirect(`https://slack.com/oauth/authorize?${query}`);
};

exports.callback = (req, res) => {
    const { code, state } = req.query;
    const storedState = req.cookies ? req.cookies[stateKey] : null;

    if (!state || state !== storedState) {
        res.redirect('/#' + querystring.stringify({ error: 'state_mismatch' }));
    } else {
        res.clearCookie(stateKey);

        const params = {
            client_id: config.SLACK_CLIENT_ID, // #addToConfig
            client_secret: config.SLACK_CLIENT_SECRET,
            code,
            redirect_uri: 'http://localhost:8888/authorize/slack/callback', // #addToConfig
        };

        axios.get('https://slack.com/api/oauth.access', { params })
            .then(saveTeamToUser)
            .then(() => res.redirect('/profile')) // urls should be config
            .catch(error => console.log('error in slack oauth callback', error));

        // this needs to be somewhere else
        function saveTeamToUser (res) {
            const team = res.data ? res.data.team : null;
            if (!team) throw new Error('Team id not present in Slack response.');
            const currentUser = req.session.passport.user;

            User.findById(currentUser)
                .then(user => {
                    const isUnique = user.slackTeams.includes(team);
                    if (!isUnique) {
                        user.slackTeams.push(team);
                        user.save();
                    }
                })
                .catch(error => console.log('error updating user', error));
        }
    }
};
