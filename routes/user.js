var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');
var Cart = require('../models/cart');

var csrfProtection = csrf();
router.use(csrfProtection);

router.get('/profile', isLoggedIn(), function(req, res, next){
    Order.find({user: req.user}, function(err, orders){
        if(err){
            return res.write('Error!');
            var cart;
            orders.forEach(function(order){
                cart = new Cart(order.cart);
                order.items = cart.generateArray();
            });
            res.render('user/profile', {orders: orders});
        }
    });
  });

router.get('/logout', isLoggedIn, function(req, res, next){
    req.logout();
    res.redirect('/');
});

router.use('/', notLoggedIn, function(req, res, next){
    next();
});

router.get('/signup', function(req, res, next){
    var message = req.flash('error');
     res.render('user/signup', {csrfToken: req.csrfToken(), message: message, hasErrors: message.length > 0});
  });
  
  router.post('/signup', passport.authenticate('local.signup', {
    successRedirect: '/user/profile',
    failureRedirect: '/user/signup',
    failureFlash: true
  }));
  
  
  router.get('/signin', function(req, res, next){
    var message = req.flash('error');
    res.render('user/signup', {csrfToken: req.csrfToken(), message: message, hasErrors: message.length > 0});
  });
  
  router.post('/signin', passport.authenticate('local.signin',{
    successRedirect: '/user/profile',
    failureRedirect: '/user/signin',
    failureFlash: true
  }));



  module.exports = router;

  function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/');  
  }

  function notLoggedIn(req, res, next){
    if(!req.isAuthenticated()){
        return next();
    }
    res.redirect('/');  
  }