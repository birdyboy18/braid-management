var _ = require('lodash');
var Models = require('../models'),
    mongoose = require('mongoose'),
    Service = require('../helpers/service.js'),
    events = require('events'),
    AppEmitter = require('../actions/app-actions.js');


var thread = {
  list: function(req, res) {
    Models.Thread.find({}).exec(function(err, threads){
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
    //check if there is a username query parameter. if there is use that one to create a new braid not the authenticated user.
    var userId;
    if (req.query.userId) {
      userId = req.query.userId;
    } else {
      userId = req.user.username;
    }

    var braidId;
    if (req.query.braidId) {
      braidId = req.query.braidId;
    } else {
      return res.json('You haven\'t supplied a braidId to assign the new thread too');
    }

    var service_meta = Service.serviceDecider(req.body.service, req.body.username);

    var newThread = new Models.Thread({
      _id: new mongoose.Types.ObjectId,
      _braidId: braidId,
      _userId: userId,
      service: req.body.service,
      name: req.body.name,
      description: req.body.description,
      service_meta: service_meta,
      active: req.body.name || false
    });

    newThread.save(function(err, thread){
      if (err) { throw err;};

      Models.Braid.findOne({ _id: braidId }, function(err, braid){
        if (err) { throw err;};

        braid.threads.push(thread._id);

        braid.save(function(err, braid){
          if (err) { throw err;};

          //Emit and event so that the scrape knows it needs to scrape.
          AppEmitter.emitChange('threadCreated', thread);
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
    Models.Thread.findOneAndUpdate({ _id: req.params.thread_id }, req.body, function(err, thread){
      if (err) { throw err;};

      res.json({
        'message': 'Thread has been sucessfully updated',
        'thread': thread
      });

    });
  },
  remove: function(req, res) {
    var userId;
    if (req.query.userId) {
      userId = req.query.userId;
    } else {
      userId = req.user.username;
    }

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

              AppEmitter.emitChange('threadRemoved', thread);
              res.status(200).json({
                'message': 'Sucessfully deleted thread, reference has been removed from braid',
                'braid': braid
              })
            })
          });

        });
      }
    });
  },
  listEntries: function(req, res) {
    Models.Entry.find({ _threadId: req.params.thread_id}, function(err, entries){
      if (err) { throw err;};

      res.status(200).json(entries);
    });
  }
}

module.exports = thread;
