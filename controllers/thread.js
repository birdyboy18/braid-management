var _ = require('lodash');
var Models = require('../models'),
    mongoose = require('mongoose'),
    Service = require('../helpers/service.js'),
    events = require('events'),
    AppEmitter = require('../actions/app-emitter.js'),
    EntryModifier = require('../services/entry-modifier.js');


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
          AppEmitter.emitChange('threadChange');
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

            //Remove all the entries from the thread
            Models.Entry.remove({ _threadId: thread._id }, function(err){
              if (err) { throw err; };
            })

            Models.Thread.remove({ _id: thread._id}, function(err){
              if (err) {throw err;};

              AppEmitter.emitChange('threadChange');
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
  },
  attachModifier: function(req, res) {
      Models.Thread.findOne({ _id: req.params.thread_id }, function(err, thread) {
        if (err) { throw err;};

        if (thread) {
        //Look up to see that modifier actually exists
        Models.Modifier.findOne({ _id: req.params.mod_id }, function(err, mod) {
          if (err) { throw err;};

          if (mod) {
            //then it exists

            mod.threads.push(thread._id);
            thread.modifiers.push(mod._id);

            mod.save();
            thread.save(function(err, thread){
              if (err) { throw err;};

              EntryModifier.applyModifiers(thread, mod);
            });
            res.status(200).json({
              'message': 'Modifier has been sucessfully attached to the thread',
              modifier: mod,
              thread: thread
            })
          } else {
            res.status(404).json({
              'message': 'Sorry we couldn\'t attach that modifier because it doesn\'t exists, please make sure the Modifier ID is correct'
            });
          }
        });
    } else {
      res.status(404).json({
        'message': 'We couldn\'t find that thread please make sure the thread ID is correct'
      });
    }
  });
  },
  removeModifier: function(req, res) {
      Models.Thread.findOne({ _id: req.params.thread_id }, function(err, thread) {
        if (err) { throw err;};

        if (thread) {
        //Look up to see that modifier actually exists
        Models.Modifier.findOne({ _id: req.params.mod_id }, function(err, mod) {
          if (err) { throw err;};

          if (mod) {
            //then it exists
            thread.modifiers.pull(mod._id);
            mod.threads.pull(thread._id);

            mod.save();
            thread.save(function(err, thread){
              if (err) { throw err;};

              EntryModifier.removeModifiers(thread, mod);
            });
            res.status(200).json({
              'message': 'Modifier has been sucessfully removed from the thread',
              modifier: mod,
              thread: thread
            });
          } else {
            res.status(404).json({
              'message': 'Sorry we couldn\'t remove that modifier because it doesn\'t exists, please make sure the Modifier ID is correct'
            });
          }
        });
    } else {
      res.status(404).json({
        'message': 'We couldn\'t find that thread please make sure the thread ID is correct'
      });
    }
  });
  }
}

module.exports = thread;
