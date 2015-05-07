var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var entry = new Schema({
  id: { type: String },
  _braidId: { type: Schema.Types.ObjectId, required: true },
  _threadId: { type: Schema.Types.ObjectId, required: true },
  service: { type: String },
  active: { type: Boolean, default: true},
  data: { type: Schema.Types.Mixed },
  modifiers: { type: Schema.Types.Mixed, default: {} }
}, { collection: 'entries', minimize: false});

module.exports = mongoose.model('Entry', entry);
