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

      function getAllMethods(object) {
        return Object.getOwnPropertyNames(object).filter(function(property) {
            return typeof object[property] == 'function';
        });
    }

      if (entries.length > 0) {
        //we have entries

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
            entry.modifiers[mod.modifier_meta.slug] = Modifier.entryDecider(options);
            entry.markModified('modifiers');
            
            entry.save(function(err, Entry){
              if (err) { throw err;};

              //console.log('Modifier has sucesfully be applied to entry');
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

        entries.map(function(entry){

        if (entry.modifiers[mod.modifier_meta.slug]) {
          delete entry.modifiers[mod.modifier_meta.slug];
          entry.markModified('modifiers');
        }          

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


function toRemove(entry, mod, cb) {
  var toRemove = [];

  //loop through every modifier and if the mod_id matches remove that entry.
  //console.log(entry.modifiers.length);

  cb(toRemove);
}
