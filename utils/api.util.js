
const axios = require('axios')

exports.request = (options) => {
    return axios(options)
        .then(({ data }) => data)
        .catch(error => {
            throw error.response.data
        })
}