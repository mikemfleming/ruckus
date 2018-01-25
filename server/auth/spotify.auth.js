'use strict';

const request = require('request');
const axios = require('axios');

const querystring = require('querystring');

const authUtil = require('../util/auth.util');
const config = require('../../config/main.config');
const SpotifyAccounts = require('../models/spotifyAccounts');

const stateKey = 'spotify_auth_state'; // confirms req is from spotify

exports.authorize = (req, res) => {
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
        res.redirect('/#' + querystring.stringify({ error: 'state_mismatch' }));
    } else {
        res.clearCookie(stateKey);

        getSpotifyTokens(code)
            .then(saveTokens)
            .then(successRedirect)
            .catch(failureRedirect);
        

        function getSpotifyTokens (authorization_code) {
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
            res.redirect('/#' + querystring.stringify({ error: message }));
        }
    }
};

// send this as needed (when messages land)
exports.refreshToken = function (userId) {
    console.log('~~~~ refreshing token')
    return SpotifyAccounts.findOne({ userId })
        .then((account) => {
            console.log(account)
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
                .then((res) => console.log('refreshToken fn success 🏔', res.data)) // start here
                .catch((error) => console.log('refreshToken fn error', error.response.data))
        })
};
