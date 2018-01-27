'use strict';

const logger = require('../../logger');
const request = require('request');
const axios = require('axios');

const querystring = require('querystring');

const authUtil = require('../util/auth.util');
const config = require('../../config/main.config');
const SpotifyAccounts = require('../models/spotifyAccounts');

const stateKey = 'spotify_auth_state'; // confirms req is from spotify

exports.authorize = (req, res) => {
    logger.info('REDIRECTING TO SPOTIFY OAUTH');

    const state = authUtil.generateRandomString(16);
    const query = querystring.stringify({
        response_type: 'code',
        client_id: config.SPOTIFY_CLIENT_ID,
        scope: config.SPOTIFY_SCOPE,
        redirect_uri: config.SPOTIFY_REDIRECT_URI,
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
        logger.error('SLACK STATE MISMATCH');
        res.redirect('/#' + querystring.stringify({ error: 'state_mismatch' }));
    } else {
        res.clearCookie(stateKey);

        getSpotifyTokens(code)
            .then(saveTokens)
            .then(successRedirect)
            .catch(failureRedirect);
        

        function getSpotifyTokens (authorization_code) {
            logger.info('GETTING SLACK DETAILS');

            const options = {
                url: 'https://accounts.spotify.com/api/token',
                method: 'post',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                params: {
                    code: authorization_code,
                    redirect_uri: config.SPOTIFY_REDIRECT_URI,
                    grant_type: 'authorization_code'
                },
                headers: { 'Authorization': 'Basic ' + (new Buffer(config.SPOTIFY_CLIENT_ID + ':' + config.SPOTIFY_CLIENT_SECRET).toString('base64')) }
            };

            return axios(options) // spotify doesn't like .get?
        }

        function saveTokens (res) {
            logger.info('SAVING SPOTIFY TOKENS');
            // this needs better logic here
            const { access_token, refresh_token } = res.data;
            const currentUserId = req.session.passport.user;
            return SpotifyAccounts.saveTokens(currentUserId, access_token, refresh_token);
        }

        function successRedirect () {
            res.redirect(config.PROFILE_URL);
        }

        function failureRedirect (error) {
            const message = error.message || 'spotify_callback_failed';
            logger.error(message)
            res.redirect('/#' + querystring.stringify({ error: message }));
        }
    }
};

// send this as needed (when messages land)
exports.refreshToken = function (userId) {
    logger.info('REFRESHING SPOTIFY TOKEN');

    return SpotifyAccounts.findOne({ userId })
        .then((account) => {
            const options = {
                method: 'post',
                url: 'https://accounts.spotify.com/api/token',
                headers: {
                    'Authorization': 'Basic ' + (new Buffer(config.SPOTIFY_CLIENT_ID + ':' + config.SPOTIFY_CLIENT_SECRET).toString('base64')),
                },
                params: {
                    grant_type: 'refresh_token',
                    refresh_token: account.refreshToken
                },
                json: true
            };

            return axios(options)
                .then((res) => {
                    const accessToken = res.data.access_token;
                    account.update({ accessToken }).then(() => logger.info(`SAVED ACCESS TOKEN FOR USER ${userId}`))
                })
                .catch((error) => logger.error(error))
        })
};
