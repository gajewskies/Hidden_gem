/*
To serve static files such as images and scripts, you need to include a 
middleware that serves static files. Put all your static files inside of 
a public directory and serve them like this.
*/

var express = require("express");
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var dbConfig = require('./db');
var http = require("http").Server(app);
var io = require("socket.io")(http);
var colors = require('colors');
var mongoose = require('mongoose');
// connect to DB
mongoose.connect(dbConfig.url);
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public/styles'));

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));

//app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname + '../public'));
app.use(express.static(__dirname + '/views'));
// configuring passport
var passport = require('passport');
var expressSession = require('express-session');
// TODO - why do we need this key?
app.use(expressSession({
    secret: 'mysecretkey',
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// Using the flash middleware provided by connect-flash to store messages in session
// and displaying in templates
var flash = require('connect-flash');
app.use(flash());

// Initialize Passport
var initPassport = require('./passport/init');
initPassport(passport);

var routes = require('./routes/index')(passport);
app.use('/', routes);

app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

var clients = [];
io.on('connection', function (socket) {
    io.emit('current clients', clients);
    socket.on('client conencted', function (client) {
        clients.push(client);
        io.emit('current clients', clients);
    });
    console.log("[*]".green + "A client has connected!");
});

module.exports = app;



/*
var http = require("http").Server(app);

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
*/