var _ = require('lodash');
var Models = require('../models'),
    mongoose = require('mongoose');


var entry = {
  list: function(req, res) {
    if ( req.query.threadId ) {
      Models.Entry.find({ _threadId: req.query.threadId }, '-__v' , function(err, entries){
        if (err) { throw err;};

        res.status(200).json(entries);
      });
    } else {
      res.status(404).json({
        'message': 'You haven\'t supplied a threadId parameter'
      });
    }
  },
  update: function(req, res) {
    if (req.params.entry_id) {
      Models.Entry.findOne({ _id: req.params.entry_id }, function(err, entry){
        if (err) { throw err;};

        //Time to update it.
        _.extend(entry, req.body);

        entry.save();
      });
    } else {
      res.status(404).json({
        'message': 'You haven\'t supplied an entryId in the url, dunno what are we looking for'
      });
    }
  }
}

module.exports = entry;
