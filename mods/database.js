// database.js

// grab mongoose for application
var mongoose = require('mongoose');

// username and password not included
var uri = "mongodb://username.password.localhost/Hidden_gem";

// connecting to our hosted database
// throwing an error message if unable to connect

mongoose.connect(uri, function(err, db) {
	if (err) {
		console.log('[!] Error: Ubanle to connect to database");
		return;
	}
});
