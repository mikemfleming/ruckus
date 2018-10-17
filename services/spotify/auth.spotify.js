
const qs = require('querystring')

// move this to a config
const { SPOTIFY_CLIENT_ID, SPOTIFY_REDIRECT_URL, SPOTIFY_CLIENT_SECRET } = process.env

const authUtil = require('../../utils/auth.util')
const apiUtil = require('../../utils/api.util')

// this should only be triggered in the configuration action
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

exports.callback = ({ code, state }) => {
    if (!code || !state) throw new Error('Missing required Spotify auth arguments')

    // somehow check the state key

    return getSpotifyTokens(code)
        // then save tokens to db

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
}
