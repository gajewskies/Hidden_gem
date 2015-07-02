
/*
To serve static files such as images and scripts, you need to include a 
middleware that serves static files. Put all your static files inside of 
a public directory and serve them like this.
*/

var express = require("express");
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var port = 44291;

var clients = [];
io.on('connection', function (socket) {
	io.emit('current clients', clients);
	socket.on('client conencted', function (client) {
		clients.push(client);
		io.emit('current clients', clients);
	});
	console.log("[*] A client has connected!");
});

// Serve static files
app.use(express.static(__dirname + '/public'));
app.use('/mods', express.static(__dirname));
app.use('/styles', express.static(__dirname + '.public'));
app.use('/slideshow', express.static(__dirname + '/public'));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/public/welcome.html");
});

http.listen(port, "0.0.0.0",  function () {
    console.log("[*] Server running at http://127.0.0.1:" + port);
});

