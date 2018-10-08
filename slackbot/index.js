
// ["token","team_id","team_domain","channel_id","channel_name","user_id","user_name","command","text","response_url","trigger_id"]
module.exports = (input) => {
	const arguments = input.text.split(' ')
	const action = arguments.shift()

	switch (action) {
		case 'save':
			return `saving ${arguments.shift()}`
		default:
			return `Error: action unsupported: ${action}`
	}
}
