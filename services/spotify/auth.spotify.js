
const qs = require('querystring')

// move this to a config
const { SPOTIFY_CLIENT_ID, SPOTIFY_REDIRECT_URL } = process.env

const authUtil = require('../../utils/auth.util')

// this should only be triggered in the configuration action
//  - the user clicks the link that this generates
//  - they go navigate in their browser to spotify and authorize ruckus
//  - spotify sends them to ruckus' success callback
//  - once they land on the callback url,
//  - save their tokens to the slack team/user id
//  - handle success & error gracefully in user display
exports.authorize = () => {
    return 'authorizing!'

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