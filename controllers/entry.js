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

        //if in the case the user is trying to update the modifier terms
        if (req.body.modifier_slug && req.body.modifier_term) {
          //get the modifier id
          var mod_id = entry.modifiers[req.body.modifier_slug]._modId;
          //find and update it with the same term
          Models.Modifier.findById(mod_id, function(err, mod){
            mod.modifier_meta.terms.push(req.body.modifier_term);
            mod.markModified('modifier_meta');
            mod.save();
          });
          //update the entries terms, mark it as modified
          entry.modifiers[req.body.modifier_slug].terms.push(req.body.modifier_term);
          entry.markModified('modifiers');
        }
        //save the changes to the entry
        entry.save(function(err,entry){
          if (err) { res.status(400).json({
            'message': err
          })};

          res.json({
            'message': 'entry succesfully modified',
            'entry': entry
          })
        });
      });
    } else {
      res.status(404).json({
        'message': 'You haven\'t supplied an entryId in the url, dunno what are we looking for'
      });
    }
  }
}

module.exports = entry;
