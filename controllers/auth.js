var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var LocalStrategy = require('passport-local').Strategy;
var Models = require('../models/');
var _ = require('lodash');

passport.use(new BasicStrategy(function(username, password, cb) {
  Models.User.findOne({ username: username}, function(err, user){
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

passport.use(new LocalStrategy(function(username, password, cb){
  Models.User.findOne({ username: username }, function(err, user){
    if (err) { return cb(err);};

    //if we didn't find a user with that username
    if (!user) { return cb(null, false, { message: 'Username is wrong, we couldn\'t find it!'}); };

    //check the password using verifyPassword method of the user
    user.verifyPassword( password, function(err, isMatch){
      if (err) { return cb(err); };

      // the password didn't match, it's wrong
      if (!isMatch) { return cb(null,false, { message: 'Password is wrong, you\'re not trying to hack in are you!'});};

      //success, they're authenticated.
      return cb(null, user);
    });
  });
}));

passport.serializeUser(function(user, cb){
  cb(null, user.username);
});

passport.deserializeUser(function(user, cb){
  Models.User.findOne({ username: user }, function(err, dbUser){
    if (err) { return cb(err)};

    cb(null, dbUser);
  })
});

var auth = {
  restrictTo: function(role) {
    return function(req, res, next) {
      if (req.user.role == role) {
        next();
      } else {
        next(res.json(403, {message: 'You need admin priveleges'}));
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
        next(res.json(403, {message: 'You need admin priveleges or to be the owner of this account'}));
      }
    }
  },
  clientIsAuthenticated: function() {
    return function(req,res,next) {
      if (!req.isAuthenticated()) {
        res.redirect('/login');
      } else {
        next();
      }
    }
  },
  isAuthorized: function() {
    return function(req,res,next) {

      function splitPath(path) {
        return path.split('/');
      }

      //if they are trying to access username
      if (req.user.username == req.params.username) {
         if (req.body.role) {
           return res.json({ message: 'Oi! cheeky, you thought you could change your role? Please remove the role parameter from your request'});
         } else if (req.body.username) {
           return res.json({ message: 'If you change your username, you\'re gonna have a bad time, don\'t change it, please remove it from the request '});
         } else {
           next();
         }
      } else if (_.contains(splitPath(req.path), 'braid')) {
        if ( req.query.userId && req.user.role != 'admin') {
          //this covers creating a braid
          res.status(403).json({ message: 'You need admin priveleges or to be the owner of this account'});
        } else if (req.params.braid_id) {
          //this covers updating, or deleting a braid, if it has a braid_id
          Models.Braid.findOne({ _id: req.params.braid_id}, function(err, braid){
            if (err) { throw err;};

            if (braid != null) {
              if (braid._userId == req.user.username || req.user.role == 'admin') {
                req.braidId = braid._id;
                next();
              } else {
                res.status(403).json({ message: 'You need admin priveleges or to be the owner of this account'});
              }
            } else {
              res.status(404).json({
                'message': 'Couldn\'t find that braid, please make sure the id is correct or that it exists'
              });
            }
          });
        } else {
          next();
        }
      } else if (_.contains(splitPath(req.path), 'modifier')) {
        if ( req.query.userId && req.user.role != 'admin') {
          //this covers creating a modifier
          res.status(403).json({ message: 'You need admin priveleges or to be the owner of this account'});
        } else if (req.params.modifier_id) {
          //this covers updating, or deleting a modifier, if it has a modifier_id
          Models.Modifier.findOne({ _id: req.params.modifier_id}, function(err, mod){
            if (err) { throw err;};

            if (mod != null) {
              if (mod._userId == req.user.username || req.user.role == 'admin') {
                next();
              } else {
                res.status(403).json({ message: 'You need admin priveleges or to be the owner of this account'});
              }
            } else {
              res.status(404).json({
                'message': 'Couldn\'t find that modifier, please make sure the id is correct or that it exists'
              });
            }
          });
        } else {
          next();
        }
      } else if (_.contains(splitPath(req.path), 'thread')) {
        if ( req.query.userId && req.user.role != 'admin') {
          //this covers creating a thread
          res.status(403).json({ message: 'You need admin priveleges or to be the owner of this account'});
        } else if (req.params.thread_id) {
          //this covers updating, or deleting a thread, if it has a thread_id
          Models.Thread.findOne({ _id: req.params.thread_id}, function(err, thread){
            if (err) { throw err;};

            if (thread != null) {
              if (thread._userId == req.user.username || req.user.role == 'admin') {
                req.threadId = thread._id;
                req.braidId = thread._braid_id;
                next();
              } else {
                res.status(403).json({ message: 'You need admin priveleges or to be the owner of this account'});
              }
            } else {
              res.status(404).json({
                'message': 'Couldn\'t find that thread, please make sure the id is correct or that it exists'
              });
            }
          });
        } else {
          next();
        }
      } else if (req.user.role == 'admin') {
        next();
      } else {
        next(res.json(403, {message: 'You need admin priveleges or to be the owner of this account'}));
      }
    }
  }

  /*
  Note to self.
  Incase you forget, consider looking at the request path, you then know what resource the user is trying to access.
  Look it up in the database. store it in the req object and then pass it on.
  You'll save lookups and potentially make a much smarter authorized module.
  You're nearly always storing a reference to the user_id. if that userId doesn't match up and they are not an admin, kick their asses out.
  1. check which resource.
  2. look up the userid and compare to the authenticated userid.
  3. if all is good store the specific resourceid in req and pass it along using next.
  */
}

//don't set a session because we want to have the user authenticate on every request.
auth.isAuthenticated = passport.authenticate('basic', {session: false});
auth.localAuthentication = passport.authenticate('local', { successRedirect: '/admin', failureRedirect: '/login', flashFailure: true});
module.exports = auth;
