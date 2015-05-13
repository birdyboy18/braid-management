/*
The user module provides methods that perform tasks in the database 
for me based on the url endpoint
*/
var _ = require('lodash');
var User = require('../models').User,
    VerificationToken = require('../models').VerificationToken,
    EmailService = require('../services/email');
    mongoose = require('mongoose');

var user = {
  //list the user, remove some properties.
  list: function(req,res) {
    User.find({},'-__v -password -_id',{}).exec(function(err, users){
      if (err) { throw err;}
      res.status(200).json(users);
    });
  },
  /*
    This first checks to see if the username already exisits, if so tell the user.
  */
  create: function(req,res) {
    User.find({username: req.body.username}).exec(function(err, users) {
      if (err) {throw err};

      if (users.length > 0) {
        //we found one, tell them it already exisits
        res.status(200).json({
          'message': 'we\'re sorry than username already exists, please pick a new one'
        });
      } else {
        //produce a new user based on the model schemas from models
        var newUser = new User({
          _id: new mongoose.Types.ObjectId,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          username: req.body.username,
          password: req.body.password,
          created: Date.now(),
          braids: [],
          modifiers: []
        });

        newUser.save(function(err, user) {
          if (err) { throw err;};

          //make a verification token, so that we can be sure it's a human and not a robot.
          var verificationToken = new VerificationToken({ _userId: user.username });
          verificationToken.createToken(function(err, token){
            if (err) return console.log("Couldn't create verification token", err);

            //We've succesfully created a user and made a verification token, send them an email man!
            var context = {
              name: user.firstName,
              verifyLink: req.protocol + '://' + req.headers.host + '/email/verify/' + token.token,
              assetsUrl: req.protocol + '://' + req.headers.host + '/public/assets/email/'
            };

            //grab the right email and then send them an email.
            EmailService.renderTemplate('./views/email/welcome.html', context, function(compiledHtml){
              var emailData = {
                from: 'Braid.io <welcome@mg.getbraid.io>',
                to: user.email,
                subject: 'Thanks for signing up',
                html: compiledHtml
              };

              EmailService.send(emailData, function(err, result){
                if (err) { throw err;};

                console.log(result);
              });

            });
          })



          res.status(201).json({
            'message': 'New user sucessfully created!',
            'user': user
          });
        });

      } // end of else
    });
  },
  /*
  update the details of a user.
  */
  update: function(req,res) {
    //use traditional find method so save is called, therefore the pre save hook is called
    if (req.params.username) {
      User.findOne({ username: req.params.username},'-__v -password', function(err, user){
        if (err) { throw err;};

        //here i'm using lodash's extend feature it will automatically fill in the only properties that have changed
        _.extend(user, req.body);

        //save the changes
        user.save(function(err, user){
          if (err) { throw err;};

          res.json({
            'message': 'User succesfully updated',
            'user': user
          });
        });
      });
    }
  },
  /*
    Find the user based on username and remove it.
  */
  remove: function(req, res) {
    if (req.params.username) {
      User.findOneAndRemove({ username: req.params.username }, function(err){
        res.json('User: ' + req.params.username + ' has been removed');
      });
    }
  }
}

module.exports = user;
