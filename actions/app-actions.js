var _ = require('lodash');
var util = require('util');
var emitter = require('events').EventEmitter;

// var AppEmitter = _.create(emitter.prototype, {
//   emitChange: function(event) {
//     this.emit(event);
//   },
//   onChange: function(event,callback) {
//     this.on(event, callback);
//   }
// });

var AppEmitter = _.create(new emitter, {
  emitChange: function(event) {
    this.emit(event);
  },
  addListener: function(event, cb) {
    this.on(event, cb);
  }
});

//util.inherits(AppEmitter,emitter);

module.exports = AppEmitter;
