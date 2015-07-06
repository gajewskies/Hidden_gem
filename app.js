/*
To serve static files such as images and scripts, you need to include a 
middleware that serves static files. Put all your static files inside of 
a public directory and serve them like this.
*/

var express = require("express");
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var colors = require('colors');
var dbConfig = require('./mods/db.js');
var mongoose = require('mongoose');

mongoose.connect(dbConfig.url);

var passport = require('passport');
var expressSession = require('express-session');
app.use(expressSession({secret: 'mysecretkey'}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
    done(null, user._id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

var port = 44290;

var clients = [];
io.on('connection', function (socket) {
	io.emit('current clients', clients);
	socket.on('client conencted', function (client) {
		clients.push(client);
		io.emit('current clients', clients);
	});
	console.log("[*]".green + "A client has connected!");
});

// Serve static files
app.use(express.static(__dirname + '/public'));
app.use('/mods', express.static(__dirname));
app.use('/styles', express.static(__dirname + '.public'));
app.use('/slideshow', express.static(__dirname + '/public'));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/public/welcome.html");
    console.log('[Get]'.green + ' / welcome.html');
});

app.get("/home", function (req, res) {
    res.sendFile(__dirname + "/public/home.html");
    console.log('[Get]'.green + ' / home.html');
});

app.get("/account", function (req, res) {
    res.sendFile(__dirname + "/public/account.html");
    console.log('[Get]'.green + ' / account.html');
});

app.get("/mapbox", function (req, res) {
    res.sendFile(__dirname + "/public/mapbox.html");
    console.log('[Get]'.green + ' / mapbox.html');
});

http.listen(port, "0.0.0.0",  function () {
    console.log("[*]".green + "Server running at http://127.0.0.1:" + port);
});
