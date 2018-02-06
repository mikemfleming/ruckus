'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const logger = require('../logger');

const spotifySchema = mongoose.Schema({
	// userId: { type: String, index: { unique: true } },
    accessToken: String,
    refreshToken: String,
});

const slackSchema = mongoose.Schema({
	teamId: String,
});

// slackSchema.index({ userId: 1, teamId: 1 }, { unique: true }); // enforce unique documents

const userSchema = mongoose.Schema({
    username: String,
    password: String,
    spotify: spotifySchema,
    slack: slackSchema
});

userSchema.methods.generateHash = (value) => {
    return bcrypt.hashSync(value, bcrypt.genSaltSync(12), null);
};

userSchema.methods.validPassword = (password) => {
    return bcrypt.compareSync(password, this.password);
};

// userSchema.statics.saveSpotifyTokens = function (userId, accessToken, refreshToken) {
// 	logger.info('SAVING SPOTIFY TOKENS');

// 	const newSpotifyAccount = new this();
// 	newSpotifyAccount.userId = userId;
// 	newSpotifyAccount.accessToken = accessToken;
// 	newSpotifyAccount.refreshToken = refreshToken;
// 	return newSpotifyAccount.save();
// };

// userSchema.statics.addNewSlackUser = function (userId, teamId) {
// 	logger.info(`CREATING NEW ACCOUNT FOR user ${userId} on team ${teamId}`);
// 	newSlackAccount.userId = userId;
// 	newSlackAccount.teamId = teamId;
// 	return newSlackAccount.save();
// };

module.exports = mongoose.model('User', userSchema);


// let UserSchema = new Schema({
//   //...
//   statuses: {
//     online: {
//       type: Boolean,
//       default: true
//     },
//     verified: {
//       type: Boolean,
//       default: false
//     },
//     banned: {
//       type: Boolean,
//       default: false
//     }
//   },
//   //...
// })