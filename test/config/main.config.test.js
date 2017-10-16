'use strict';

const assert = require('assert');
const fs = require('fs');

require('dotenv').config(); // set env variables
const config = require('../../config/main.config');

describe('Configuration and Environment', function() {
	describe('Node version', function () {
		it('Should be on Node v8.6.0', function () {
			assert.equal(process.version, 'v8.6.0');
		});
	});

	describe('Environment Variables', function() {
		const variables = fs.readFileSync('.sample-env')
				.toString()
				.split('\n')
				.map((pair) => pair.split('=')[0])
				.filter(variable => variable !== '');

		variables.forEach((name) => it(`Sets ${name}`, () => assert(!!config[name], true)));
	});
});
