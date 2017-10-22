'use strict';

const mongoose = require('mongoose');

const slackAccountSchema = mongoose.Schema({
    userId: String,
    teamId: String,
});

slackAccountSchema.statics.addNewAccount = function (userId, teamId) {
	const newSlackAccount = new this();
	newSlackAccount.userId = userId;
	newSlackAccount.teamId = teamId;
	return newSlackAccount.save();
};

module.exports = mongoose.model('SlackAccount', slackAccountSchema);
