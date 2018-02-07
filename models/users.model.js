'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const log = require('../logger');

const spotifySchema = mongoose.Schema({
	// userId: { type: String, index: { unique: true } },
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

userSchema.statics.captureSlackDetails = function (details) {
    log.info('WRITING SLACK DETAILS TO RUCKUS USER');
    const userToUpdate = { _id: details.ruckusUserId };
    const updates = {
        'slack.userId': details.userId,
        'slack.teamId': details.teamId
    };
    return this.update(userToUpdate, updates);
};


module.exports = mongoose.model('User', userSchema);
