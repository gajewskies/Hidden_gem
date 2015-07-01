// Data transfer class to move dave from the controller

var apiResponse = function (configure) {
	this.success = configure.success;
	this.extras = configure.extras;
};

module.exports = apiResponse;
