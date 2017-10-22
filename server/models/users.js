'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
    username: String,
    password: String
});

userSchema.methods.generateHash = (value) => {
    return bcrypt.hashSync(value, bcrypt.genSaltSync(12), null);
};

userSchema.methods.validPassword = (password) => {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
