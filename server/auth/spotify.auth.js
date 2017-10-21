'use strict';

const request = require('request');
const axios = require('axios');

const querystring = require('querystring');

const authUtil = require('../util/auth.util');
const config = require('../../config/main.config');
const User = require('../models/users');

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
            User.addSpotifyTokens(req.session.passport.user, res.data);
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
exports.refreshToken = function(req, res) {
    console.log('refresh tokening')
    // requesting access token from refresh token
    // don't use var anymore
    var refresh_token = req.query.refresh_token;
    var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: { 'Authorization': 'Basic ' + (new Buffer(config.SPOTIFY_CLIENT_ID + ':' + config.SPOTIFY_CLIENT_SECRET).toString('base64')) }, // #addToConfig
        form: {
            grant_type: 'refresh_token',
            refresh_token: refresh_token
        },
        json: true
    };

    request.post(authOptions, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            var access_token = body.access_token;
            res.send({
                'access_token': access_token
            });
        }
    });
};
