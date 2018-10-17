
const qs = require('querystring')

const slackbot = require('./slackbot')
const spotifyAuth = require('./services/spotify/auth.spotify')

exports.handler = async event => {
	console.log('~~~~~~~ request received', JSON.stringify(event, null, 4))
	let payload

	try {
		if (event.queryStringParameters) {
			// request is from spotify
			const { code, state } = event.queryStringParameters

			payload = await spotifyAuth.callback({ code, state })
		} else {
			if (!event.body) throw new Error('No request body detected')

			const input = qs.decode(Buffer.from(event.body, 'base64').toString())

			payload = await slackbot(input)
		}
	} catch (error) {
		console.log('ERROR', JSON.stringify(error))
		payload = `Error: ${error.message}`
	}

	const response = {
			statusCode: 200,
			body: payload
	}

	return response
};
