/////////////////////////////////////
var Cronofy = require('cronofy');

var client = new Cronofy({
  access_token: 'O7hOoeRJ88fUcrQsfDPjHgTHaGrJQ0rm',
});

var morgan = require('morgan')
var express = require("express");
var app = express()
var request = require('request');

// Set the headers
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
            "code":"3xkDicUpyONtKVVvzI6nrzI_G3kZmKMs",
            "redirect_uri": "http://localhost:50000/"
        }   
};

var morgan = require('morgan')
var express = require("express");
var app = express()
app.get("/test2", function(req, res) {
request(options, function (error, response, body) {
    //console.log(options);
    console.log("error!");
    console.log(body);
  if (!error && response.statusCode == 200) {
    console.log(body.id) // Print the shortened url.
  }
});
});

var options1 = {
  tzid: 'Etc/UTC'
};

var options2 = {
  to: "2017-11-28T12:00:00Z",
  from: "2017-11-29T12:00:00Z",
  tzid: 'Etc/UTC'
};

// client.listCalendars(options1)
//   .then(function (response) {
//         console.log("LIST CALANDERS");
//       var calendars = response.calendars;
//       console.log(calendars);
//   });
var http = require("http");
var request = require("request");


// var express = require("express");

// var options = {
//   hostname: 'api.cronofy.com',
//   port: 50000,
//   path: '/oauth/token',
//   method: 'POST',
//   form: {"client_id": "kr6-FkR4BVLCYE2uQHbzqPSGI_6rWV-D", "client_secret": "jr-6gY6mQAgOa3KhbLhIYP0F6WjpRBMKXUPNrFB5WGwllrNM2Ao6PPQHtOb2m0zyDUH4D_-K2RFfOcy--ML8wA", "grant_type": "authorization_code", "code": "RKbQTba4iSozNNOLTq2sdn3Y2gQkLksb","redirect_uri": "http://localhost:50000"},
//   headers: {
//       'Content-Type': 'application/json',
//   }
// };
// request(options, function (error, response, body) {
//     if (!error && response.statusCode == 200) {
//         // Print out the response body
//         console.log(body)
//     }
// })

// var morgan = require('morgan')
// var express = require("express");
// var app = express()
// app.set('view engine', 'ejs');app.set('view engine', 'ejs');
// app.use(morgan('tiny'))
// var http=require('http')
// app.use(express.static('public'));
app.get("/", function(req, res) {
    res.sendFile(__dirname + '/index.html');
});
// app.get("/test", function(req, res) {
//     res.sendFile(__dirname + '/test.html');
// });
// app.post('/endpoint', function(req, res){
//   var obj = {};
//   console.log('body: ' + JSON.stringify(req.body));
//   res.send(req.body);
// });

app.listen(50000);