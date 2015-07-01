// user.js
// user's attributes to be stored in the database

var mongoose = require('mongoose');
var schema = mongoose.Schema;

var userSchema = new schema ({
	firstname: String,
	lastname: String,
	username: String,
	email: String,
	passwordHash: String,
	passwordsalt: String
});

module.exports = mongoose.model('User', userSchema);
