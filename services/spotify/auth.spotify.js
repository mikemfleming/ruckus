
const qs = require('querystring')
// const bcrypt = require('bcrypt')

// move this to a config
const { SPOTIFY_CLIENT_ID, SPOTIFY_REDIRECT_URL, SPOTIFY_CLIENT_SECRET } = process.env

const authUtil = require('../../utils/auth.util')
const apiUtil = require('../../utils/api.util')
const db = require('../../db')

// this should only be triggered in the configuration action
//  - this will need a team/user id
//  - the user clicks the link that this generates
//  - they go navigate in their browser to spotify and authorize ruckus
//  - spotify sends them to ruckus' success callback
//  - once they land on the callback url,
//  - save their tokens to the slack team/user id
//  - handle success & error gracefully in user display
exports.authorize = () => {
    const state = authUtil.generateRandomString(16)
    const query = qs.stringify({
        response_type: 'code',
        client_id: SPOTIFY_CLIENT_ID,
        scope: 'playlist-modify-public',
        redirect_uri: SPOTIFY_REDIRECT_URL,
        state,
    })

    // res.cookie(stateKey, state)

    // request authorization from spotify
    return `https://accounts.spotify.com/authorize?${query}`
}

function getSpotifyTokens (code) {
    const options = {
        url: 'https://accounts.spotify.com/api/token',
        method: 'post',
        params: {
            code,
            redirect_uri: SPOTIFY_REDIRECT_URL,
            grant_type: 'authorization_code',
        },
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64')}`,
        },
    }

    return apiUtil.request(options)
}

exports.callback = (code, state) => {
    if (!code || !state) throw new Error('Missing required Spotify auth arguments')

    // somehow check the state key to make sure the req is from where it should be
    //  - i say somehow because i'm not yet certain how lambda can handle sessions
    // save tokens WITH the slack team_id
    //  - will need sessions for this because:
    //  - this request is not from slack, so we will need a way to match the tokens
    //      from this response up with a slack team_id
    // maybe send slack team id as state
    return getSpotifyTokens(code)
        .then(db.saveTokens)
        .then(() => 'Saved Spotify Tokens')
        .catch((error) => { throw error })
        // .then return html error/success
}

exports.refreshTokens = (refresh_token) => {
    const options = {
        url: 'https://accounts.spotify.com/api/token',
        method: 'post',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + (new Buffer(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64'))
        },
        params: {
            grant_type: 'refresh_token',
            refresh_token: refresh_token
        },
        json: true
    }

    return apiUtil.request(options)
}
