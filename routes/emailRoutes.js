var express = require('express');
    router = express.Router();

//Get the email service module
var Email = require('../services/email.js');

router.get('/verify/failure', function(req, res) {
  res.json({
    'message': 'It looks like your account didn\'t verify we\'ll send you a new email with a new verify link out'
  });
});

router.get('/verify/success', function(req, res) {
  res.json({
    'message': 'Oh right! it looks like it worked! congratulations on not being a robot!'
  });
});

router.get('/verify/:token', function(req, res){
  Email.verifyUser(req.params.token, function(err, user){
    //redirect them accordingly
    if (err) {
      res.redirect('/email/verify/failure');
    } else {
      res.redirect('/email/verify/success');
    }
  });
});

router.get('/requestTest', function(req, res) {
  res.json('Check yo console' + req.headers.host);
  console.log(req.headers.host);
})

module.exports = router;
