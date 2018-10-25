
const AWS = require('aws-sdk')
const uuid = require('uuid/v1')

AWS.config.update({ region: 'us-east-1' })

const docClient = new AWS.DynamoDB.DocumentClient()

exports.getMostRecentTokens = () => {
    return docClient.scan({ TableName: 'ruckusUsers' }).promise()
        .then(({ Items }) => Items.reduce((x, y) => x.timestamp > y.timestamp ? x : y))
}

// savetokens should automatically encrypt
exports.saveTokens = ({ access_token, refresh_token }) => {
    return docClient.put({
        TableName: 'ruckusUsers',
        Item: {
            userId: uuid(),
            timestamp: new Date().getTime(),
            access_token,
            refresh_token 
        }
    }).promise()
}
