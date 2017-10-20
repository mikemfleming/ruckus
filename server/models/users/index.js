'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
    username: String,
    password: String,
    slackTeams: Array,
    spotifyAccessToken: String,
    spotifyRefreshToken: String,
});

userSchema.methods.generateHash = (value) => {
    return bcrypt.hashSync(value, bcrypt.genSaltSync(12), null);
};

userSchema.methods.validPassword = (password) => {
    return bcrypt.compareSync(password, this.password);
};

userSchema.statics.addSlackTeam = function (userId, teamData) {
	this.findById(userId)
		.then(function (user) {
			const isUnique = user.slackTeams.filter((team) => team.id === teamData.id).length === 0;
			if (isUnique) {
			    user.slackTeams.push(teamData);
			    user.save();
			}
		})
};

module.exports = mongoose.model('User', userSchema);
