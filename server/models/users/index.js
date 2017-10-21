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
	return this.findById(userId)
		.then(function (user) {
			const isUnique = user.slackTeams.filter((team) => team.id === teamData.id).length === 0;
			if (isUnique) {
			    user.slackTeams.push(teamData);
			    user.save();
			}
		})
		.catch(function (err) {
			throw new Error('Error adding Slack team');
		});
};

userSchema.statics.addSpotifyTokens = function (userId, tokens) {
	const { access_token, refresh_token } = tokens;

	this.findById(userId)
		.then(function (user) {
			user.spotifyAccessToken = user.generateHash(access_token);
			user.spotifyRefreshToken = user.generateHash(refresh_token);
			user.save();
		});
};

module.exports = mongoose.model('User', userSchema);
