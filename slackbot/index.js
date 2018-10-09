
// ["token","team_id","team_domain","channel_id","channel_name","user_id","user_name","command","text","response_url","trigger_id"]
module.exports = (input) => {
	if (!input.text) throw new Error('Malformed request body')
	const arguments = input.text.split(' ')
	const action = arguments.shift()

	switch (action) {
		case 'save':
			// extract id from spotify uri and url
			const track = /(?<=spotify:track:).*|(?<=spotify.com\/track\/).*(?=\?)/
				.exec(arguments.shift())

			if (track) {
				return `saving ${track}`
			}
			throw new Error('Invalid resource shape')
		default:
			throw new Error(`Unsupported action: ${action}`)
	}
}
