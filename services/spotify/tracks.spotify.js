
const apiUtil = require('../../utils/api.util')
const spotifyAuth = require('./auth.spotify')

// move this to config
const { SPOTIFY_ACCESS_TOKEN } = process.env
const playlist = '4qIaLCTPEef0Zsy8G4deZz'

exports.add = track => {
    // TODO: capture spotify user id and the playlist they want to add to
    const options = {
        url: `https://api.spotify.com/v1/playlists/${playlist}/tracks`,
        method: 'post',
        params: { uris: `spotify:track:${track}` },
        headers: {
            Authorization: `Bearer ${SPOTIFY_ACCESS_TOKEN}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    }
    return 'adding track!'
    
    return apiUtil.request(options)
        .then(() => console.log('success')) // success logic: maybe just return 'added track!'
        .catch(({ error }) => {
            console.log('~~~~ error adding tract', JSON.stringify(error))
			throw error			
            // this should actually be a call to refresh the user's tokens
            //  - they should have already authorized the app using configure
            //  - if the error is an expired token,
            //  - this will query the db for the user's refresh token
            //  - make a request to spotify to get a new access token using the refresh token
            //  - update the db with the new tokens
            //  - retry the addTrack request
            // return spotifyAuth.authorize()
        })
}
