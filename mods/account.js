var accountController = function (userModel, session, mailer) {
	this.crypto = require('crypto');
	this.uuid = require('node-uuid');
	this.apiResponse = require('./apiResponse.js');
	this.apiMessages = require('./apiMessages.js');
	this.userProfile = require('./userProfile.js');
	this.userModel = userModel;
	this.session = session;
	this.mailer = mailer;
};

module.exports = accountController;