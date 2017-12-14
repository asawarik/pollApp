const express = require('express');
var cookieParser = require('cookie-parser')
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
var crypto = require("crypto");
const connectedUsers = [];
var currUser;
//var request = require('request');
function genuuid(callback) {
  if (typeof(callback) !== 'function') {
    return uuidFromBytes(crypto.randomBytes(16));
  }

  crypto.randomBytes(16, function(err, rnd) {
    if (err) return callback(err);
    callback(null, uuidFromBytes(rnd));
  });
}
function uuidFromBytes(rnd) {
  rnd[6] = (rnd[6] & 0x0f) | 0x40;
  rnd[8] = (rnd[8] & 0x3f) | 0x80;
  rnd = rnd.toString('hex').match(/(.{8})(.{4})(.{4})(.{4})(.{12})/);
  rnd.shift();
  return rnd.join('-');
}
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

// Load View Engine
var engines = require('consolidate');


// Configure the request

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs')
app.engine('html', require('ejs').renderFile);

// Body Parser Middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// Set Public Folder
app.use(express.static(path.join(__dirname, 'public')));

// Express Session Middleware
app.use(cookieParser());
// app.use(session({
//   secret: 'keyboard cat',
//   resave: true,
//   saveUninitialized: true,
// }));
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
// app.post("/", function(req, res) {
//   console.log("hello!!");
//   console.log(req);
//   res.render("index.html");

// });
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
let routes = require('./routes/index');
app.use('/users', users);
app.use('/', routes);
// Start Server
var server = app.listen(50000, function(){
  console.log('Server started on port 50000...');
});

function findSocket(username, users) {
  console.log(username);
  var i;
  console.log("in the find socket function");
  for (i=0; i < users.length; i++) {
    var userObject = users[i];
    if (userObject["username"] == username) {
        return userObject["socketid"];
    }
  }
  printArray(users);
  return "not online"

};

function removeSocket(disconnectId, users) {
  var j;
  for (j=0; j < users.length; j++) {
    var userObject = users[j];
    if (userObject["socketid"] == disconnectId) {
      connectedUsers.splice(j, 1);   
    }
  }
};

function printArray(ugh) {
  console.log("in the print funciton");
  var k;
  for (k=0; k < ugh.length; k++) {
    var userObject = ugh[k];
    console.log(JSON.stringify(userObject));
  }
};
var io = require("socket.io").listen(server);
var toMessage;
var toSocket;
var fromSocket;
io.on('connection', function(socket){
  var socketid = socket.id;
  socket.on('messageUser', function(user) {
    connectedUsers.push({"username":user, "socketid":socketid});
    printArray(connectedUsers);
  });
  
  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
    socket.on('toMessage', function(username) {
      toMessage = username;
      toSocket = findSocket(toMessage, connectedUsers);
    if (!(toSocket == "not online")) {
        io.sockets.connected[toSocket].emit("chat message", msg);
        //io.sockets.connected[fromSocket].emit("chat message", msg);
      }
  });
    
    //io.emit('chat message', msg);
  });
  socket.on('disconnect', function(){
    console.log('user disconnected');
    var disconnectUser = socket.id;
    removeSocket(disconnectUser, connectedUsers);
    printArray(connectedUsers);
    console.log("completed removal");
    // var disconnectId = socket.id;
    // io.emit('getUser', "blah");
    // console.log("cinpmleted the disconnect");
  });
});