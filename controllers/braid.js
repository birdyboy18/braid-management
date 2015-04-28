var _ = require('lodash');
var Models = require('../models'),
    mongoose = require('mongoose'),
    AppEmitter = require('../actions/app-emitter.js');

var braid = {
  list: function(req, res) {
    Models.Braid.find({},'-__v',{}, function(err, braids){
      if (err) { throw err;};

      res.json(braids)
    });
  },
  create: function(req, res) {
    //check if there is a username query parameter. if there is use that one to create a new braid not the authenticated user.
    var userId;
    if (req.query.userId) {
      userId = req.query.userId;
    } else {
      userId = req.user.username;
    }

      var newBraid = new Models.Braid({
        _id: new mongoose.Types.ObjectId,
        _userId: userId,
        name: req.body.name,
        description: req.body.description
      });

      newBraid.save(function(err, braid){
        if (err) { throw err;};

        Models.User.findOne({ username: braid._userId},'-__V -password', function(err, user){
          if (err) { throw err;};

          user.braids.push(braid._id);

          user.save(function(err, user){
            if (err) { throw err;};

            res.json(201,{
               'message': 'New braid succesfully created',
               'user': user,
               'braid': braid
            });
          })
        })
      });
  },
  update: function(req,res) {
    Models.Braid.findOneAndUpdate({ _id: req.braidId }, req.body, function(err, braid){
      if (err) { throw err;};

      res.json({
        'message': 'Braid Sucessfully updated',
        'braid': braid
      });
    });
  },
  remove: function(req,res) {

    Models.Braid.findOne({ _id: req.braidId }, function(err, braid){
      if (err) { throw err;};

      Models.User.findOne({ username: braid._userId },'-password', function(err, user){
        if (err) { throw err;};

        //pull the braid id from the braid array on the user
        user.braids.pull(braid._id);

        //save it, once it save remove the braid from the collection
        user.save(function(err, user){
          if (err) { throw err;};

          //find the threads and the entries, belonging to the braid and remove all of them.
          Models.Thread.findOne({ _braidId: braid._id }, function(err, thread){
            if (err) { throw err;};

            //find the entries with the threadID and remove them
            Models.Entry.remove({ _threadId: thread._id }, function(err) {
              if (err) { throw err;};

              //now we can remove the thread
              Models.Thread.remove({ _id: thread._id }, function(err) {
                if (err) { throw err;};

                AppEmitter.emitChange('threadChange');
              });
            });
          })

          //Finally remove the braid
          Models.Braid.remove({ _id: braid._id}, function(err){
            if (err) {throw err;};

            res.status(200).json({
              'message': 'Sucessfully deleted braid, reference has been removed from user and all threads and entries too',
              'user': user
            })
          })
        });

      });

    });
  }
};

module.exports = braid;
