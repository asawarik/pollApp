const express = require("express");
const router = express.Router();

router.get('/', function(req, res){
  console.log(req.session);
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

module.exports = router;