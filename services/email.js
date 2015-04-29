var config = require('../config.js');
var mailgun = require('mailgun-js')({apiKey: config.apiKeys.mailgun , domain: config.domains.mailgun });
var hogan = require('hogan');
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

      callback(body);
    });
  },
  renderTemplate: function(template, data) {
    //var template = fs.readFileSync(file);
    var email = hogan.compile(template);
    return email.render(data);
  }
}

module.exports = email;
