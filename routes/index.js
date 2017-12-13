const express = require("express");
const router = express.Router();

router.get('/', function(req, res){
  console.log(req.session);
  console.log("in the get");
  res.render('index.html');
});


module.exports = router;