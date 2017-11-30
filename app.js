/////////////////////////////////////
var Cronofy = require('cronofy');

var client = new Cronofy({
  access_token: 'TNkZwDizIfW5yL5jCZ5gQHhD5bL96mLX',
});

var options1 = {
  tzid: 'Etc/UTC'
};

var options2 = {
  to: "2017-11-28T12:00:00Z",
  from: "2017-11-29T12:00:00Z",
  tzid: 'Etc/UTC'
};

client.listCalendars(options1)
  .then(function (response) {
        console.log("LIST CALANDERS");
      var calendars = response.calendars;
      console.log(calendars);
  });
// client.readEvents(options)
//   .then(function (response) {
//     //console.log("in the read function");
//       var events = response.events;
//       //console.log(events);
//   });

// client.freeBusy(options2)
//   .then(function (response) {
//     console.log("in the free busy");
//       var events = response.events;
//       console.log(events);
//   });

// var options = {
//   calendar_id: "cal_Wh3ecMYxg0neAAGL_PwB8sp57DFTZXwQ3@Q2CPg",
//   event_id: "unique-event-id",
//   summary: "Board meeting",
//   description: "Discuss plans for the next quarter.",
//   start: "2017-12-01T12:00:00Z",
//   end: "2017-12-01T12:30:00Z",
//   location: {
//     description: "Board room"
//   }
// };

// client.createEvent(options)
//   .then(function () {
//       console.log("created!");// Success
//   });
//////////////////////////////////
var express = require("express");
var morgan = require('morgan')
var app = express()
app.set('view engine', 'ejs');app.set('view engine', 'ejs');
app.use(morgan('tiny'))
var http=require('http')
app.use(express.static('public'));
app.get("/", function(req, res) {
    res.sendFile(__dirname + '/index.html');
});
app.listen(50000);