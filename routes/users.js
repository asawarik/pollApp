const morgan = require('morgan');
const request = require("request");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require('passport');
var template = null;
var template2 = null;
let User = require("../models/user");

router.get("/register", function(req, res) {
    res.render("register.html");
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

var headers1 = {
    'Accept':     'application/json',
    'Accept-Charset': 'utf-8',
    Authorization: ""
}

// Configure the request
var options1 = {
    headers: headers1,
    uri: 'https://api.cronofy.com/v1/userinfo',
    method: 'GET'
};
function getCalID(access_token) {
  headers1["Authorization"] = "Bearer " + access_token;
  request(options1, function(error, response, body) {
    if (!error && response.statusCode == 200) {
        var parseBody = JSON.parse(body);
        console.log(parseBody);
        template = parseBody["sub"];

    }
    else {
      console.log("no");
    }
  });
};
//adding new user to the db
router.post("/register", function(req, res) {
    //console.log("im here");
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    const password2 = req.body.password2;
    const code = req.body.code;
    var access_token = "";
    options["json"]["code"] = code;
    //console.log("CODEEEEE");
    //console.log(options);
    request(options, function (error, response, body) {
      console.log("fejwjfWEEEE");
      if (!error && response.statusCode == 200) {
        console.log("HELLLLO IM HERE");
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
        console.log(calID);
        console.log(template);
        console.log(access_token);
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
//Fetching all users from the db 
router.get('/yay', function(req, res) {
  User.find({}, function(err, docs) {
    if(err) {
    res.json(err);
    } else {
      console.log(docs);
      res.render('yay', {users: docs});
    }
  });
});


// Login Form
router.get('/login', function(req, res){
  res.render('login.html');
});

const Cronofy = require("cronofy");
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
  console.log(req.sessionID);
  console.log("in the get");
  res.render('poll.html', {currUser: req.user});
});

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
router.post("/poll", function(req, res) {
  console.log("REQUEST!!!!!!!!");
  var times;
  var calId = req.body.cal_id;
  console.log(calId);
  var access_token = req.body.access_token;
  headers100["Authorization"] = "Bearer " + access_token;
  request(options100, function(error, response, body) {
    if (!error && response.statusCode == 200) {
        //var parseBody = JSON.parse(body);
        //console.log(body["available_periods"]);
        times = body["available_periods"];
        console.log("success!");
        console.log(times);
        res.render("poll.html", {times: times});
    }
    else {
      console.log(error);
      console.log(response.statusCode);
      console.log("no");
    }
  });
  //console.log(times);
  
});

router.get('/loginFail', function(req, res){
  res.render('loginFail.html');
});


router.get('/loginSuccess', function(req, res){
  console.log("OMFG HERE IS THE SESSION");
  console.log(req.sessionID);
  hello = getAllUsers();
  function doStuff1() {
          if(template2== undefined) {//we want it to match
            //console.log (template)
            setTimeout(doStuff1, 50);//wait 50 millisecnds then recheck
            return;
          }
        else {
          if (!req.session.visitCount) {
            req.session.visitCount = 1;
          }
          else {
            req.session.visitCount += 1;
          }
          //console.log(req.session);
          //console.log("END O FSESIOFID");
          //console.log(template2);
          res.render('loginSuccess', {user: req.user, allUsers:template2});
        }
      }//closes do stuff function
      doStuff1();
});

router.get('/signup', function(req, res){
  res.render('signup.html');
});
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

