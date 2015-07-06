var express = require('express');
var router = express.Router();

// As with any middleware it is quintessential to call next()
// if the user is authenticated
var isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/');
}

module.exports = function(passport){
 
  /* GET login page. */
  router.get('/', function(req, res) {
    // Display the Login page with any flash message, if any
    res.render('welcome', { message: req.flash('message') });
  });
 
  /* Handle Login POST */
  router.post('/login', passport.authenticate('login', {
    successRedirect: '/home',
    failureRedirect: '/',
    failureFlash : true 
  }));
 
  /* GET Registration Page */
  router.get('/welcome', function(req, res){
    res.render('welcome',{message: req.flash('message')});
  });
 
  /* Handle Registration POST */
  router.post('/signup', passport.authenticate('signup', {
    successRedirect: '/home',
    failureRedirect: '/welcome',
    failureFlash : true 
  }));

  /* GET Home Page */
router.get('/home', isAuthenticated, function(req, res){
  res.render('home', { user: req.user });
});

/* Handle Logout */
  router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

 
  return router;
}