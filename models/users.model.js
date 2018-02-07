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

userSchema.methods.generateHash = function (value) {
    return bcrypt.hashSync(value, bcrypt.genSaltSync(12), null);
};

userSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

userSchema.statics.getSlackMembers = function (id) {
    return this.find({ 'slack.teamId': id });
};


module.exports = mongoose.model('User', userSchema);
