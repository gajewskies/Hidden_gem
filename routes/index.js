var express = require('express');
var router = express.Router();

var isAuthenticated = function (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler 
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated())
		return next();
	// if the user is not authenticated then redirect him to the login page
	res.redirect('/');
}

module.exports = function(passport){

	/* GET Home Page */
	router.get('/home', isAuthenticated, function(req, res){
		res.render('home', { 
			user: req.user 
		});
	});

	/* GET login page. */
	router.get('/', function(req, res) {
    	// Display the Login page with any flash message, if any
		res.render('welcome', { 
			title: 'HiddenGem-login-register', 
			message: req.flash('message') 
		});
	});

	/* GET Registration Page */
	router.get('/welcome', function(req, res){
		res.render('welcome',{
			title: 'HiddenGem-login-register',
			message: req.flash('message')
		});
	});

	/* GET Accounts Page */
	router.get('/account', isAuthenticated, function(req, res) {
	    res.render('account', {
	        title: 'Account Page',
	        user: req.user
    	});
	});



	/* Handle Logout */
	router.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});


	/* Handle Login POST */
	router.post('/login', passport.authenticate('login', {
		successRedirect: '/home',
		failureRedirect: '/',
		failureFlash : true  
	}));


	/* Handle Registration POST */
	router.post('/signup', passport.authenticate('signup', {
		successRedirect: '/home',
		failureRedirect: '/home',
		failureFlash : true  
	}));

	return router;
}