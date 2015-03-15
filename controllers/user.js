var User = require('../models').User,
    mongoose = require('mongoose');

var user = {
  list: function(req,res) {
    User.find({},'-__v',{}, function(err, users){
      if (err) { throw err;}

      res.json(users);
    });
  },
  create: function(req,res) {
    User.find({username: req.body.username}).exec(function(err, users) {
      if (err) {throw err};

      if (users.length > 0) {
        //we found one, tell them it already exisits
        res.json({
          'message': 'we\'re sorry than username already exists, please pick a new one'
        });
      } else {

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
          res.json({
            'message': 'New user sucessfully created!',
            'user': user
          });
        });

      } // end of else
    });
  },
  update: function(req,res) {
    if (req.params.username) {
      User.findOneAndUpdate({ username: req.params.username}, req.body, {}, function(err, user){
        if (err) { throw err;}
        res.json({
        'message': 'User succesfully updated',
        'user': user
        })
      })
    }
  },
  remove: function(req, res) {
    if (req.params.username) {
      if (req.user.role != 'admin') { return res.json(401, {message: 'You need admin privaledges'})};
      User.findOneAndRemove({ username: req.params.username }, function(err, user){
        res.json('User: ' + req.params.username + ' has been removed');
      });
    }
  }
}

module.exports = user;
