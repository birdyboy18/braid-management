var _ = require('underscore');
var Models = require('../models'),
    mongoose = require('mongoose');


var thread = {
  list: function(req, res) {
    Models.Thread.find({},{},{}, function(err, threads){
      if (threads.length > 0) {
        res.json(threads);
      } else {
        res.status(404).json({
          'message': 'Couldn\'t find any threads'
        })
      }
    });
  },
  create: function(req, res) {
    var newThread = new Models.Thread({
      _id: new mongoose.Types.ObjectId,
      _braidId: req.params.braid_id,
      _userId: req.params.username,
      service: req.body.service,
      name: req.body.name,
      description: req.body.description
    });

    newThread.save(function(err, thread){
      if (err) { throw err;};

      Models.Braid.findOne({ _id: req.params.braid_id }, function(err, braid){
        if (err) { throw err;};

        braid.threads.push(thread._id);

        braid.save(function(err, braid){
          if (err) { throw err;};

          res.status(201).json({
            'message': 'Thread sucessfully created and reference has been added to braid',
            'braid': braid,
            'thread': thread
          });
        });
      });
    });
  },
  update: function(req, res) {
    Models.Thread.findOneAndUpdate({ username: req.params.thread_id }, req.body, function(err, thread){
      if (err) { throw err;};

      res.json({
        'message': 'Thread has been sucessfully updated',
        'thread': thread
      });

    });
  },
  remove: function(req, res) {
    Models.Thread.findOne({ _id: req.params.thread_id }, function(err, thread){
      if (err) { throw err;};

      if (thread == null) {
        return res.status(404).json({
          'message': 'Can\'t find that thread, please double check the id is correct or that it exists'
          });
      } else {

        Models.Braid.findOne({ _id: thread._braidId }, function(err, braid){
          if (err) { throw err;};

          //pull the thread id from the threads array on the braid
          braid.threads.pull(thread._id);

          //save it, once its saved remove the thread from its collection
          braid.save(function(err, braid){
            if (err) { throw err;};

            Models.Thread.remove({ _id: thread._id}, function(err){
              if (err) {throw err;};

              res.status(200).json({
                'message': 'Sucessfully deleted thread, reference has been removed from braid',
                'braid': braid
              })
            })
          });

        });
      }
    });
  }
}

module.exports = thread;
