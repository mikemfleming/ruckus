
const spotifyTracks = require('../../services/spotify/tracks.spotify')

module.exports = (args) => {
	// extract id from spotifyTracks uri or url
	// this regex needs to identify the service as well
	const arg = args.shift()
	const track = /(?<=spotify:track:).*|(?<=spotify.com\/track\/).*(?=\?)/
				.exec(arg)

	if (track) {
		return spotifyTracks.add(track)
	}

	throw new Error('Invalid track resource')
}