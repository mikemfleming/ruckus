'use strict';

const log = require('../logger');
const request = require('request');
const axios = require('axios');
const apiUtil = require('../util/api.util');

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
    const ruckusUserId = req.session && req.session.passport ? req.session.passport.user : null;
    if (!ruckusUserId) throw new Error('RUCKUS USER ID NOT PRESENT IN SESSION');

    const { code, state } = req.query;
    const storedState = req.cookies ? req.cookies[stateKey] : null;

    if (!state || state !== storedState) {
        log.error('SPOTIFY STATE MISMATCH');
        res.redirect('/#' + querystring.stringify({ error: 'state_mismatch' }));
    } else {
        res.clearCookie(stateKey);

        getSpotifyTokens(code)
            .then(saveTokens)
            .then(successRedirect)
            .catch(failureRedirect);
        
        // TODO: get spotify user id and save it here
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

            return apiUtil.request(options) // spotify doesn't like .get?
        }

        function saveTokens (data) {
            const accessToken = data.access_token;
            const refreshToken = data.refresh_token;

            if (!accessToken || !refreshToken) throw new Error('Tokens were not present in Spotify response.');

            return Users.captureSpotifyDetails({ ruckusUserId, accessToken, refreshToken });
        }

        function successRedirect () {
            res.redirect(ENDPOINTS.PROFILE);
        }

        function failureRedirect (error) {
            log.error(error);
            const message = error.message || 'spotify_callback_failed';
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
