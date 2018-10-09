
const qs = require('querystring')

const slackbot = require('./slackbot')

exports.handler = async event => {
	let payload

	try {
		const input = qs.decode(
			Buffer.from(event.body, 'base64').toString()
		)

		payload = slackbot(input)

	} catch (error) {
		payload = error.message
	}

	const response = {
			statusCode: 200,
			body: payload
	}

	return response
};