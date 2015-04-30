var config = require('../config.js');
var mailgun = require('mailgun-js')({apiKey: config.apiKeys.mailgun , domain: config.domains.mailgun });
var hogan = require('hogan');
var Models = require('../models');
var fs = require('fs');

/*
var data = {
  from: 'Braid.io <welcome@mg.paulbird.co>'
  to: 'paulbird1993@gmail.com'
  subject: 'Testing Emails'
  text: 'Testing some mailgun email awesomeness'
}
*/

var email = {
  send: function(data, callback) {

    mailgun.messages().send(data, function(err, body){
      if (err) { callback(err); };

      callback(null,body);
    });
  },
  renderTemplate: function(file, data, cb) {
    var template = fs.readFileSync(file, 'utf-8');
    var email = hogan.compile(template);
    cb(email.render(data));
  },
  verifyUser: function(token, cb) {
    Models.VerificationToken.findOne({ token: token}, function(err, token){
      if (err) { cb(err);};

      if (token == null) {
        return cb(true,'Couldn\'t find token in database');
      }

      Models.User.findOne({ username: token._userId }, function(err, user){
        if (err) { cb(err);};

        user.verified = true;
        user.save(function(err, user){
          if (err) { cb(true,err);};

          cb(null,user);
        });
      })
    })
  }
}

module.exports = email;
