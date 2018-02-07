'use strict';

const axios = require('axios');
const log = require('../logger');

exports.request = function (options) {
	log.info(`MAKING ${options.method} REQUEST TO ${options.url}`);
	const config = {
	    url: options.url,
	    method: options.method,
	    headers: options.headers,
	    params: options.params
	 };

	 return axios(config)
	 	.then((res) => res.data);
};