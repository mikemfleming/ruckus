'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const log = require('../logger');

const spotifySchema = mongoose.Schema({
	userId: String,
    accessToken: String,
    refreshToken: String,
});

const slackSchema = mongoose.Schema({
    userId: String,
	teamId: String,
});

// slackSchema.index({ userId: 1, teamId: 1 }, { unique: true }); // enforce unique documents

const userSchema = mongoose.Schema({
    username: String,
    password: String,
    spotify: spotifySchema,
    slack: slackSchema
});

userSchema.methods.generateHash = function (value) {
    log.info('GENERATING HASH');
    return bcrypt.hashSync(value, bcrypt.genSaltSync(12), null);
};

userSchema.methods.validPassword = function (password) {
    log.info('VALIDATING PASSWORD');
    return bcrypt.compareSync(password, this.password);
};

userSchema.statics.getSlackMembers = function (id) {
    log.info('GETTING SLACK MEMBERS');
    return this.find({ 'slack.teamId': id });
};

userSchema.methods.addSlackDetails = function (userId, teamId) {
    log.info('WRITING SLACK DETAILS TO RUCKUS USER');
    this.slack = { userId, teamId };
    this.save();
};

userSchema.methods.addSpotifyTokens = function (accessToken, refreshToken) {
    log.info('WRITING SPOTIFY DETAILS TO RUCKUS USER');
    this.spotify = { accessToken, refreshToken };
    this.save();
};

userSchema.methods.updateAccessToken = function (accessToken) {
    log.info('UPDATING SPOTIFY ACCESS TOKEN');
    this.spotify.accessToken = accessToken;
    this.save();
};


module.exports = mongoose.model('User', userSchema);
