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

        //loop through every entry
        entries.map(function(entry){
          if (entry.modifiers[mod.modifier_meta.slug]) {
            //don't add it it exists
          } else {
            var options = {
              _modId: mod._id,
              type: mod.type,
              name: mod.name,
              slug: mod.modifier_meta.slug,
              slug_singular: mod.modifier_meta.slug_singular
            }
            //returns a empty modifer based on the type of modifier, it's decided by the modiferentryDecider
            entry.modifiers[mod.modifier_meta.slug] = Modifier.entryDecider(options);
            entry.markModified('modifiers');
            //save the new data added to the entry
            entry.save(function(err, Entry){
              if (err) { throw err;};
            });
          }

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

        //loop through the entries
        entries.map(function(entry){
        //if the slug of the modifier matches then delete the entire object
        if (entry.modifiers[mod.modifier_meta.slug]) {
          delete entry.modifiers[mod.modifier_meta.slug];
          entry.markModified('modifiers');
        }          

        //then save
        entry.save(function(err, entry){
          if (err) { throw err;};
            console.log('Modifier has sucesfully been removed from the entry');
          });
        });

      } else {
        console.log('Couldn\'t find any entries, does the thread have any entries?');
      }
    })
  }
}

module.exports = entryModifier;
