/*
I'm good at inconsitently giving names,
the purpose of this is to abstract a way of adding empty modifier data to all the entries of a given thread.
*/

var Models = require('../models');
var Modifier = require('../helpers/modifier.js');
var _ = require('lodash');

var entryModifier = {
  applyModifiers: function(thread, mod) {
    Models.Entry.find( { _threadId: thread._id}, function(err, entries){
      if (err) { throw err;};

      if (entries.length > 0) {
        //we have entries

        entries.map(function(entry){
          /*
          we need to check if the entry hasn't already had that modifier applied, or else,
          we will be overwriting it and we don't want that if the user has filled it out
          */
          entry.modifiers.map(function(modifier){
            console.log(modifier);
          })
          entry.modifiers.push(Modifier.entryDecider(mod));

          entry.save(function(err, entry){
            if (err) { throw err;};

            console.log('Modifier has sucesfully be applied to entry');
          });

        });
      } else {
        console.log('Couldn\'t find any entries, does the thread have any entries?');
      }
    });
  },
  removeModifiers: function(thread, mod) {
    Models.Entry.find( { _threadId: thread._id }, function(err, entries){
      if (err) { throw err;};

      if (entries.length > 0) {
        //we have entries

        entries.map(function(entry){

          for (var i = 0; i < entry.modifiers.length; i++) {
            if (entry.modifiers[i]._modId.toString() === mod._id.toString()) {
              entry.modifiers.splice(0,i);
            }
          }

          entry.save(function(err, entry){
            if (err) { throw err;};

            //console.log('Modifier has sucesfully been removed from the entry');
          });
        });

      } else {
        console.log('Couldn\'t find any entries, does the thread have any entries?');
      }
    })
  }
}

module.exports = entryModifier;


function toRemove(entry, mod, cb) {
  var toRemove = [];

  //loop through every modifier and if the mod_id matches remove that entry.
  //console.log(entry.modifiers.length);

  cb(toRemove);
}
