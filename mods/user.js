var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema ({
	firstname: String,
	lastname: String,
	email: String,
	passwordHash: String,
	passwordSalt: String
});

module.exports = mongoose.model('User', UserSchema);