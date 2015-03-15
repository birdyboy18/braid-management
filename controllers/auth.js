var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var User = require('../models/user');

passport.use(new BasicStrategy(function(username, password, cb) {
  User.findOne({ username: username}, function(err, user){
    if (err) {return cb(err)};

    //if we didn't find a user with that username
    if (!user) { return cb(null, false); };

    //check the password using verifyPassword method of the user
    user.verifyPassword( password, function(err, isMatch){
      if (err) { return cb(err); };

      // the password didn't match, it's wrong
      if (!isMatch) { return cb(null,false);};

      //success, they're authenticated.
      return cb(null, user);
    });
  });
}));

var auth = {
  restrictTo: function(role) {
    return function(req, res, next) {
      if (req.user.role == role) {
        next();
      } else {
        next(res.json(401, {message: 'You need admin priveleges'}));
      }
    }
  },
  restrictToSelf: function() {
    return function(req,res,next) {
      if (req.user.username == req.params.username) {
        next();
      } else if (req.user.role == 'admin') {
        next();
      } else {
        next(res.json(401, {message: 'You need admin priveleges or to be the owner of this account'}));
      }
    }
  }
}

auth.isAuthenticated = passport.authenticate('basic', {session: false});

//don't set a session because we want to have the user authenticate on every request.
module.exports = auth;
