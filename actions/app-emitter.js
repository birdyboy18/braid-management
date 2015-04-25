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
