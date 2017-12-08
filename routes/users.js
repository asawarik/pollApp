const morgan = require('morgan');
const request = require("request");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require('passport');
let User = require("../models/user");

router.get("/register", function(req, res) {
    res.render("register");
});
var headers = {
    'Accept':     'application/json',
    'Accept-Charset': 'utf-8'
}

// Configure the request
var options = {
    headers: headers,
    uri: 'https://api.cronofy.com/oauth/token',
    method: 'POST',
    json: { "client_id": "kr6-FkR4BVLCYE2uQHbzqPSGI_6rWV-D",
            "client_secret": "jr-6gY6mQAgOa3KhbLhIYP0F6WjpRBMKXUPNrFB5WGwllrNM2Ao6PPQHtOb2m0zyDUH4D_-K2RFfOcy--ML8wA",
            "grant_type": "authorization_code",
            "code":"KdOEy_iNu78aetLs8QxUh2qsuXh4GV5X",
            "redirect_uri": "http://localhost:50000/users/register"
        }   
};


router.post("/register", function(req, res) {
    console.log("im here");
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    const password2 = req.body.password2;
    const code = req.body.code;
    var access_token = "";
    options["json"]["code"] = code;
    console.log("CODEEEEE");
    console.log(options);
    request(options, function (error, response, body) {
      
      if (!error && response.statusCode == 200) {
        console.log("HELLLLO IM HERE");
        console.log(body);
        console.log(body["access_token"]);
        access_token = body["access_token"];
        console.log("about to create new user");
        console.log("aCCESS TOKEN");
        console.log(access_token);
        let newUser = new User({
          email:email,
          username:username,
          password:password,
          access_token:access_token
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
          });//newUser.save
        });//bryp.hash
      });//bcryptgensalt
      } //if !error statement  
    }); //request function   
}); //router post

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

router.get('/signup', function(req, res){
  res.render('signup');
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

