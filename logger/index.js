const pino = require('pino');

module.exports = pino({ level: 'info', prettyPrint: true });
