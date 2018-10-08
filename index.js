
const qs = require('querystring')

const slackbot = require('./slackbot')

exports.handler = async event => {
	let payload

	try {
		const input = qs.decode(
			Buffer.from(event.body, 'base64').toString()
		)

		const output = slackbot(input)

		payload = JSON.stringify(output)
	} catch (error) {
		payload = error.message
	}

	const response = {
			statusCode: 200,
			body: payload
	}

	return response
};