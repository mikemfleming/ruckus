'use strict';

const log = require('../logger');
const request = require('request');
const axios = require('axios');

const querystring = require('querystring');

const authUtil = require('../util/auth.util');
const { SPOTIFY, ENDPOINTS } = require('../config/main.config');
const Users = require('../models/users.model');

const stateKey = 'spotify_auth_state'; // confirms req is from spotify

exports.authorize = (req, res) => {
    log.info('REDIRECTING TO SPOTIFY OAUTH');

    const state = authUtil.generateRandomString(16);
    const query = querystring.stringify({
        response_type: 'code',
        client_id: SPOTIFY.CLIENT_ID,
        scope: SPOTIFY.SCOPE,
        redirect_uri: ENDPOINTS.SPOTIFY.REDIRECT_URL,
        state: state,
    });

    res.cookie(stateKey, state);

    // request authorization from spotify
    res.redirect(`https://accounts.spotify.com/authorize?${query}`);
};

exports.callback = (req, res) => {
    const { code, state } = req.query;
    const storedState = req.cookies ? req.cookies[stateKey] : null;

    if (!state || state !== storedState) {
        log.error('SPOTIFY STATE MISMATCH');
        console.log(state, storedState)
        res.redirect('/#' + querystring.stringify({ error: 'state_mismatch' }));
    } else {
        res.clearCookie(stateKey);

        getSpotifyTokens(code)
            .then(saveTokens)
            .then(successRedirect)
            .catch(failureRedirect);
        

        function getSpotifyTokens (authorization_code) {
            log.info('GETTING SPOTIFY DETAILS');

            const options = {
                url: 'https://accounts.spotify.com/api/token',
                method: 'post',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                params: {
                    code: authorization_code,
                    redirect_uri: ENDPOINTS.SPOTIFY.REDIRECT_URL,
                    grant_type: 'authorization_code'
                },
                headers: { 'Authorization': 'Basic ' + (new Buffer(SPOTIFY.CLIENT_ID + ':' + SPOTIFY.CLIENT_SECRET).toString('base64')) }
            };

            return axios(options) // spotify doesn't like .get?
        }

        function saveTokens (res) {
            // this needs better logic here
            const { access_token, refresh_token } = res.data;
            const _id = req.session.passport.user;
            return Users.update({ _id }, { $set : { 'spotify.accessToken': access_token, 'spotify.refreshToken': refresh_token } })
                .then(() => log.info('SAVED SPOTIFY TOKENS'));
        }

        function successRedirect () {
            res.redirect(ENDPOINTS.PROFILE);
        }

        function failureRedirect (error) {
            const message = error.message || 'spotify_callback_failed';
            log.error(message)
            res.redirect('/#' + querystring.stringify({ error: message }));
        }
    }
};

// send this as needed (when messages land)
exports.refreshToken = function (_id) {
    log.info('REFRESHING SPOTIFY TOKEN');

    return Users.findOne({ _id })
        .then((account) => {
            const options = {
                method: 'post',
                url: 'https://accounts.spotify.com/api/token',
                headers: {
                    'Authorization': 'Basic ' + (new Buffer(SPOTIFY.CLIENT_ID + ':' + SPOTIFY.CLIENT_SECRET).toString('base64')),
                },
                params: {
                    grant_type: 'refresh_token',
                    refresh_token: account.spotify.refreshToken
                },
                json: true
            };

            return axios(options)
                .then((res) => {
                    const accessToken = res.data.access_token;
                    return Users.update({ _id }, { $set: { 'spotify.accessToken': accessToken } })
                        .then(() => accessToken);
                })
                .catch((error) => log.error(error))
        })
};
