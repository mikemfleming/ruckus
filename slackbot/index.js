
const save = require('./actions/save')
const configure = require('./actions/configure.action')

// ["token","team_id","team_domain","channel_id","channel_name","user_id","user_name","command","text","response_url","trigger_id"]
module.exports = (input) => {
    if (!input.text) throw new Error('Malformed request body')
    
    const args = input.text.split(' ')
    const action = args.shift()

    switch (action) {
    case 'save':
        return save(args)
    case 'configure':
        return configure(args)
    default:
        throw new Error(`Unsupported action: ${action}`)
    }
}
