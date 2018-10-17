
const spotifyAuth = require('../../services/spotify/auth.spotify')

// this identifies the service
module.exports = (args) => {
    const service = args.shift()

    switch (service) {
    case 'spotify':
        return spotifyAuth.authorize()
    default:
        throw new Error('Invalid service')
    }
}