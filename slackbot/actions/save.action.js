
const spotifyTracks = require('../../services/spotify/tracks.spotify')

module.exports = (args, user_name) => {
	// extract id from spotifyTracks uri or url
	// this regex needs to identify the service as well
	const arg = args.shift()
	const track = /(?<=spotify:track:).*|(?<=spotify.com\/track\/).*(?=\?)/
				.exec(arg)

	if (track) {
		return spotifyTracks.add(track)
			.then(() => JSON.stringify({
					response_type: 'in_channel',
					text: `${user_name} saved a track for you. https://open.spotify.com/track/${track}`
			}))
	}

	throw new Error('Invalid track resource')
}