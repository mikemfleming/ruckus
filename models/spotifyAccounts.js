'use strict';

const mongoose = require('mongoose');
const logger = require('../logger');

const spotifyAccountSchema = mongoose.Schema({
    userId: { type: String, index: { unique: true } },
    accessToken: String,
    refreshToken: String,
});

spotifyAccountSchema.statics.saveTokens = function (userId, accessToken, refreshToken) {
	logger.info('SAVING SPOTIFY TOKENS');

	const newSpotifyAccount = new this();
	newSpotifyAccount.userId = userId;
	newSpotifyAccount.accessToken = accessToken;
	newSpotifyAccount.refreshToken = refreshToken;
	return newSpotifyAccount.save();
};

module.exports = mongoose.model('SpotifyAccount', spotifyAccountSchema);
