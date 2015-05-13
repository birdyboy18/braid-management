/*
This event emitter allows me to set callbacks to be run 
when a certain even runs. It's used to notify the scraper whenever a thread is deleted, 
or created so it knows what threads it should scrape.
*/

var _ = require('lodash');
var util = require('util');
var emitter = require('events').EventEmitter;

var AppEmitter = _.create(new emitter, {
  emitChange: function(event) {
    this.emit(event);
  },
  addListener: function(event, cb) {
    this.on(event, cb);
  }
});

module.exports = AppEmitter;
