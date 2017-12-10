const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const config = require('./config/database');
const request = require("request");
var currUser;
//var request = require('request');

mongoose.connect(config.database);
let db = mongoose.connection;

// Check connection
db.once('open', function(){
  console.log('Connected to MongoDB');
});

// Check for DB errors
db.on('error', function(err){
  console.log(err);
});

// Init App
const app = express();
// const Cronofy = require("cronofy");
// var cronofyClient = new Cronofy({
//   "client_id": "kr6-FkR4BVLCYE2uQHbzqPSGI_6rWV-D",
//   "client_secret": "jr-6gY6mQAgOa3KhbLhIYP0F6WjpRBMKXUPNrFB5WGwllrNM2Ao6PPQHtOb2m0zyDUH4D_-K2RFfOcy--ML8wA",
//   "access_token": "1NPQTGQ7pEnkLnjfGqZwopB3BC2y1Ite",
//   "refresh_token": "-2-bhZ-6BRIm5biGHNuagBagUv4SfFUw"
// });
 
// var options = {
//   code: 'GOv3mzT-bZQlLA_wE-o_v8eVvVkXCkDc',
//   redirect_uri: 'http://localhost:50000/users/register'
// };
// var options = {
//    tzid: "Etc/UTC"
//  }
// var options = {
//   from: "2017-12-08",
//   to: "2017-12-09",
//   tzid: "America/Indianapolis"
// }
// var headers1 = {
//     'Accept':     'application/json',
//     'Accept-Charset': 'utf-8',
//     Authorization: "Bearer 1NPQTGQ7pEnkLnjfGqZwopB3BC2y1Ite"
// }

// // Configure the request
// var options1 = {
//     headers: headers1,
//     uri: 'https://api.cronofy.com/v1/userinfo',
//     method: 'GET'
// };

// Bring in Models

// Load View Engine
var engines = require('consolidate');


// Configure the request

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs')
app.engine('html', require('ejs').renderFile);
app.get('/', function(req, res){
  console.log("in the get");
  // cronofyClient.freeBusy(options)
  // .then(function(response){
  //   console.log(response);
  // });
  // request(options1, function (error, response, body) {
      
  //     if (!error && response.statusCode == 200) {
  //       console.log("HELLLLO IM HERE");
  //       console.log(body);
  //     }
  //     else{
  //       console.log("flisajf");
  //     }
  // });
  res.render('index.html');
});
// Body Parser Middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// Set Public Folder
app.use(express.static(path.join(__dirname, 'public')));

// Express Session Middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));

// Express Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Express Validator Middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));
//
app.post("/", function(req, res) {
  console.log("hello!!");
  console.log(req);
  res.render("index.html");

});
// Passport Config
require('./config/passport')(passport);
// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('*', function(req, res, next){
  res.locals.user = req.user || null;
  next();
});


// Route Files
let users = require('./routes/users');
app.use('/users', users);

// Start Server
app.listen(50000, function(){
  console.log('Server started on port 50000...');
});