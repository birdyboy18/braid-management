var _ = require('underscore');
var Models = require('../models'),
    mongoose = require('mongoose');

var braid = {
  list: function(req, res) {
    Models.Braid.find({},'-__v',{}, function(err, braids){
      if (err) { throw err;};

      res.json(braids)
    });
  },
  create: function(req, res) {
    Models.Braid.find({ _id: req.body.braid_id }).exec(function(err, braid){
      if (err) { throw err;};

      if (braid.length > 0) {
        res.json({
          'message': 'This braid already exists, if you\'re trying to modify it please use a put request'
        });
      } else {

        var newBraid = new Models.Braid({
          _id: new mongoose.Types.ObjectId,
          _userId: req.params.username,
          name: req.body.name,
          description: req.body.description
        });

        newBraid.save(function(err, braid){
          if (err) { throw err;};

          Models.User.findOneAndUpdate({ username: braid._userId }, { $push: {braids: braid._id}}, { safe: true, upsert: true}, function(err, user){
            if (err) { throw err;};

            res.json(201,{
              'message': 'New braid succesfully created',
              'user': user,
              'braid': braid
            });
          });
        });
      } // end of else
    });
  },
  update: function(req,res) {
    Models.Braid.findOneAndUpdate({ _id: req.params.braid_id }, req.body, function(err, braid){
      if (err) { throw err;};

      res.json({
        'message': 'Braid Sucessfully updated',
        'braid': braid
      });
    });
  },
  remove: function(req,res) {
    Models.Braid.findOne({ _id: req.params.braid_id }, function(err, braid){
      if (err) { throw err;};

      if (!braid.length > 0) {
        return res.json('Can\'t find that braid, please double check the id is correct or that it exists');
      }

      Models.User.findOne({ username: braid._userId }, function(err, user){
        if (err) { throw err;};

        //pull the braid id from the braid array on the user
        user.braids.pull(braid._id);

        //save it, once it save remove the braid from the collection
        user.save(function(err, user){
          braid.remove({ _id: req.params.braid_id }, function(err) {
            if (err) { throw err;};

            res.json({
              'message': 'braid ' + req.params.braid_id + ' has been succesfully deleted and removed from the user',
              'user': user
            });
          });
        });
      });
    });
  }
};

module.exports = braid;
