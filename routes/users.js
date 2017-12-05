const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require('passport');
let User = require("../models/user");

router.get("/register", function(req, res) {
    res.render("register");
});

router.post("/register", function(req, res) {
    console.log("im here");
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    const password2 = req.body.password2;

    console.log("about to create new user");
    let newUser = new User({
      email:email,
      username:username,
      password:password
    });

    bcrypt.genSalt(10, function(err, salt){
      bcrypt.hash(newUser.password, salt, function(err, hash){
        if(err){
          console.log("in brcrypt err");
          console.log(err);
        }
        newUser.password = hash;
        newUser.save(function(err){
          if(err){
            console.log("in the save function eror");
            console.log(err);
            return;
          } else {
            req.flash('success','You are now registered and can log in');
            res.redirect('/users/login');
          }
        });
      });
    });
});

// Login Form
router.get('/login', function(req, res){
  res.render('login');
});

router.get('/loginFail', function(req, res){
  res.render('loginFail');
});

router.get('/loginSuccess', function(req, res){
  res.render('loginSuccess');
});
// Login Process
router.post('/login', function(req, res, next){
  passport.authenticate('local', {
    successRedirect:'/users/loginSuccess',
    failureRedirect:'/users/loginFail',
    failureFlash: true
  })(req, res, next);
});

// logout
router.get('/logout', function(req, res){
  req.logout();
  req.flash('success', 'You are logged out');
  res.redirect('/users/login');
});

module.exports = router;

