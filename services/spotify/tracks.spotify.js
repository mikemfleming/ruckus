
const apiUtil = require('../../utils/api.util')
const spotifyAuth = require('./auth.spotify')
const db = require('../../db')

// move this to config
const { SPOTIFY_ACCESS_TOKEN } = process.env
const playlist = '4qIaLCTPEef0Zsy8G4deZz'

exports.add = track => {
    return db.getMostRecentTokens()
        .then((data) => {
            const { access_token, refresh_token } = data
            const options = {
                url: `https://api.spotify.com/v1/playlists/${playlist}/tracks`,
                method: 'post',
                params: { uris: `spotify:track:${track}` },
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }

            return apiUtil.request(options)
                .catch(({ error }) => {
                    if (error.status == 401) {
                        return spotifyAuth.refreshTokens(refresh_token)
                            .then(db.saveTokens)
                            .then(data => JSON.stringify(data)) // try again
                            .catch(err => { throw err })
                    }
                    throw error			
                    // if: Error.message == The access token expired
                    //  this should actually be a call to refresh the user's tokens
                    //  - they should have already authorized the app using configure
                    //  - if the error is an expired token,
                    //  - this will query the db for the user's refresh token
                    //  - make a request to spotify to get a new access token using the refresh token
                    //  - update the db with the new tokens
                    //  - retry the addTrack request
                    // return spotifyAuth.authorize()
                })
        })
}
