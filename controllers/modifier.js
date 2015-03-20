var _ = require('underscore');
var Models = require('../models'),
    mongoose = require('mongoose');

var modifier = {
  list: function(req, res) {
    Models.Modifier.find({},{},{}, function(err, mods){
      if (err) { throw err;};

      if (mods.length > 0) {
        res.json(mods)
      } else {
        res.status(404).json({
          'message': 'Couldn\'t find any modifiers'
        })
      }
    });
  },
  create: function(req, res) {
    var newModifier = new Models.Modifier({
      _id: new mongoose.Types.ObjectId,
      _userId: req.params.username,
      type: req.body.type,
      name: req.body.name,
      description: req.body.description
    });

    newModifier.save(function(err, mod){
      if (err) { throw err;};

      Models.User.findOne({ username: req.params.username }, function(err, user){
        if (err) { throw err;};


        user.modifiers.push(mod._id);

        user.save(function(err, user){
          res.status(201).json({
            'message': 'Modifier succesfully created',
            'user': user,
            'modifier': mod
          })
        });
      });
    });
  },
  update: function(req, res) {
    Models.Modifier.findOneAndUpdate({ _id: req.params.modifier_id }, req.body, function(err, mod){
      if (err) { throw err;};

      res.json({
        'message': 'Modifier Sucessfully updated',
        'modifier': mod
      });
    });
  },
  remove: function(req, res) {
    Models.Modifier.findOne({ _id: req.params.modifier_id }, function(err, mod){
      if (err) { throw err; };

      if (mod == null) {
        res.status(404).json({
          'message': 'can\'t find that modifier, please check the modifier id is correct or that it exists'
        });
      } else {

        Models.User.findOne({ username: mod._userId}, function(err, user){
            if (err) { throw err;};

            //remove the modifier reference from the user
            user.modifiers.pull(mod._id);

            //save the user
            user.save(function(err, user){
              if (err) { throw err;};

              Models.Modifier.remove({ _id: mod._id }, function(err){
                if (err) { throw err;};

                res.json({
                  'message': 'Modifier ' + mod._id + ' has sucessfully been removed and reference has been removed from user',
                  'user': user
                })
              });

            });
        });
      } //end of else
    });
  }
};

module.exports = modifier;
