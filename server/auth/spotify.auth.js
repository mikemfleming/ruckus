'use strict';

const request = require('request');
const axios = require('axios');

const querystring = require('querystring');

const authUtil = require('../helpers/auth.util');
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

        const options = {
            url: 'https://accounts.spotify.com/api/token',
            method: 'post',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            params: {
                code: code,
                redirect_uri: config.SPOTIFY_REDIRECT_URI,
                grant_type: 'authorization_code'
            },
            headers: { 'Authorization': 'Basic ' + (new Buffer(config.SPOTIFY_CLIENT_ID + ':' + config.SPOTIFY_CLIENT_SECRET).toString('base64')) }
        };

        axios(options)
            .then((response) => {
                // Object.keys(response) => [ 'status', 'statusText', 'headers', 'config', 'request', 'data' ]
                // Object.keys(response.data) => [ 'access_token', 'token_type', 'expires_in', 'refresh_token', 'scope' ]

                // now save the tokens to the current user
                const { access_token, refresh_token } = response.data;
                const currentUser = req.session.passport.user;

                User.findById(currentUser)
                    .then((user) => {
                        user.spotifyAccessToken = user.generateHash(access_token);
                        user.spotifyRefreshToken = user.generateHash(refresh_token);
                        user.save();
                    })

                const options = {
                    url: 'https://api.spotify.com/v1/me',
                    method: 'get',
                    headers: {
                        'Authorization': 'Bearer ' + access_token,
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                };

                // use access token to access the Spotify API
                axios(options)
                    .then((response) => {
                        console.log('success ~~~~~~~~~~~~~~~~~~', response.data)
                    })
                    .catch((error) => {
                        console.log('error ~~~~~~~~~~~~~~~~~~', error.response)
                    });

            })
            .catch((err) => {
                res.redirect('/#' + querystring.stringify({ error: 'invalid_token' }));
            });
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
