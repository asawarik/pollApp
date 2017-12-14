//Handles all routes begining with URl localhost/users/
//Constants
const morgan = require('morgan');
const request = require("request");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require('passport');
const Cronofy = require("cronofy");
var template = null;
var template2 = null;
let User = require("../models/user");

//Signup 
router.get('/signup', function(req, res){
  res.render('signup.html');
});
//Register
router.get("/register", function(req, res) {
    res.render("register.html");
});
// Login Form
router.get('/login', function(req, res){
  res.render('login.html');
});

// Login Process
router.post('/login', function(req, res, next){
  passport.authenticate('local', {
    successRedirect:'/users/loginSuccess',
    failureRedirect:'/users/loginFail',
    failureFlash: true
  })(req, res, next);
});
//Login Fail
router.get('/loginFail', function(req, res){
  res.render('loginFail.html');
});

//Login Pass Logic
var loginPassHeaders = {
    'Accept':     'application/json',
    'Accept-Charset': 'utf-8'
}
var loginPassOptions = {
  headers: loginPassHeaders,
  uri: 'https://api.cronofy.com/oauth/token',
  method: 'POST',
  json: {
    "client_id": "kr6-FkR4BVLCYE2uQHbzqPSGI_6rWV-D",
    "client_secret": "jr-6gY6mQAgOa3KhbLhIYP0F6WjpRBMKXUPNrFB5WGwllrNM2Ao6PPQHtOb2m0zyDUH4D_-K2RFfOcy--ML8wA",
    "grant_type": "refresh_token",
    "refresh_token": "-hVK8fez-XX19f6z8mX8Asf1k01_SNrW"
  }
}
router.get('/loginSuccess', function(req, res){
  var user = req.user.username;
  hello = getAllUsers();
  loginPassOptions["json"]["refresh_token"] = req.user.refresh_token;
  //refresh the token first and then do the rest of request
  request(loginPassOptions, function(error, response, body) {
    if (!error && response.statusCode == 200) {
        var newAccessToken = body["access_token"];
        var newRefreshToken = body["refresh_token"];
        //save new tokens in db
        User.findOneAndUpdate(
          {"username": user}, 
          { $set: {"access_token": newAccessToken} },
          {new: true},
          function(err, doc) {
            if(err){
              console.log("somehting went wrong!")
            }
            else {
              console.log(doc);
              console.log("ok apparently it went htrough");
            }
        });
    }
    else {
      console.log(error);
      console.log(response.statusCode);
    }
  });
  //synchronously get all users
  function syncGetUsers() {
          if(template2== undefined) {//we want it to match
            setTimeout(syncGetUsers, 50);//wait 50 millisecnds then recheck
            return;
          }
        else {
          if (!req.session.visitCount) {
            req.session.visitCount = 1;
          }
          else {
            req.session.visitCount += 1;
          }
          res.render('loginSuccess', {user: req.user, allUsers:template2});
        }
      }//closes do stuff function
      syncGetUsers();
});

// Logout Process
router.get('/logout', function(req, res){
  req.logout();
  req.flash('success', 'You are logged out');
  res.redirect('/users/login');
});

/////DB saving and register config
// Configure the request
var calIdHeaders = {
    'Accept':     'application/json',
    'Accept-Charset': 'utf-8',
    Authorization: ""
}

var calIdOptions = {
    headers: calIdHeaders,
    uri: 'https://api.cronofy.com/v1/userinfo',
    method: 'GET'
};
function getCalID(access_token) {
  calIdHeaders["Authorization"] = "Bearer " + access_token;
  request(calIdOptions, function(error, response, body) {
    if (!error && response.statusCode == 200) {
        var parseBody = JSON.parse(body);
        template = parseBody["sub"];

    }
    else {
      console.log("no");
    }
  });
};

//User registers and is added the DB
router.post("/register", function(req, res) {
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    const password2 = req.body.password2;
    const code = req.body.code;
    var access_token = "";
    options["json"]["code"] = code;
    request(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        access_token = body["access_token"];
        refresh_token = body["refresh_token"];
        calID = getCalID(access_token);
        function doStuff() {
          if(template== undefined) {//we want it to match
            console.log (template)
            setTimeout(doStuff, 50);//wait 50 millisecnds then recheck
            return;
          }
        else {
        calId = template;
        let newUser = new User({
          email:email,
          username:username,
          password:password,
          access_token:access_token,
          refresh_token:refresh_token,
          cal_id:template
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
              console.log("this happened");
              req.flash('success','You are now registered and can log in');
              res.redirect('/users/login');
            }
          });//newUser.save
        });//bryp.hash
      });//bcryptgensalt
       }
       };
       doStuff();
      } //if !error statement  
    }); //request function   
}); //router post

//Scheduled Time Config 
var headers100 = {
    'Accept':     'application/json',
    'Accept-Charset': 'utf-8',
    Authorization: ""
}

// Configure the request
var options100 = {
    headers: headers100,
    uri: 'https://api.cronofy.com/v1/availability',
    method: 'POST',
    json: {
        "participants": [
          {
            "members": [
              {     
                "sub": "acc_5a1dde4fcd62561c6600009d" 
              },
              {
                "sub": "acc_5a2d9856cd62565016000b9f"
              }
            ],
            "required": "all"
          }
        ],
        "required_duration": { "minutes": 30 },
        "available_periods": [
          {
            "start": "2017-12-18T17:00:00Z",
            "end": "2017-12-19T02:00:00Z"
    }
  ]
}
};


//Let user see time results for person selected 
router.post("/poll", function(req, res) {
  console.log("REQUEST!!!!!!!!");
  var times;
  var calId = req.body.cal_id;
  console.log(calId);
  var messageUser = req.body.currUsername;
  var access_token = req.body.access_token;
  var messageSendUser = req.body.messageSendUser;
  headers100["Authorization"] = "Bearer " + access_token;
  request(options100, function(error, response, body) {
    if (!error && response.statusCode == 200) {
        //var parseBody = JSON.parse(body);
        //console.log(body["available_periods"]);
        times = body["available_periods"];
        console.log("success!");
        console.log(times);
        res.render("poll.html", {times: times, messageUser: messageUser, toUser: messageSendUser});
    }
    else {
      console.log(error);
      console.log(response.statusCode);
      console.log("no");
    }
  });
  //console.log(times);
  
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


var cronofyClient = new Cronofy({
  "client_id": "kr6-FkR4BVLCYE2uQHbzqPSGI_6rWV-D",
  "client_secret": "jr-6gY6mQAgOa3KhbLhIYP0F6WjpRBMKXUPNrFB5WGwllrNM2Ao6PPQHtOb2m0zyDUH4D_-K2RFfOcy--ML8wA",
  "access_token": "1NPQTGQ7pEnkLnjfGqZwopB3BC2y1Ite",
  "refresh_token": "-2-bhZ-6BRIm5biGHNuagBagUv4SfFUw"
});
 var options7 = {
  from: "2017-12-08",
  to: "2017-12-09",
  tzid: "America/Indianapolis"
}
router.get('/poll', function(req, res){
  res.render('poll.html', {currUser: req.user});
});


//Helper Functions
function getAllUsers() {
  var allUsers;
  User.find({}, function(err, docs) {
    if(err) {
    //res.json(err);
    } else {
      template2 = docs;
      //console.log(allUsers);
      
    }
  });
};


module.exports = router;

