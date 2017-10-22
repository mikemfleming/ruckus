'use strict';

const mongoose = require('mongoose');

const spotifyAccountSchema = mongoose.Schema({
    userId: String,
    accessToken: String,
    refreshToken: String,
});

spotifyAccountSchema.statics.saveTokens = function (userId, accessToken, refreshToken) {
	const newSpotifyAccount = new this();
	newSpotifyAccount.userId = userId;
	newSpotifyAccount.accessToken = accessToken;
	newSpotifyAccount.refreshToken = refreshToken;
	return newSpotifyAccount.save();
};

module.exports = mongoose.model('SpotifyAccount', spotifyAccountSchema);
