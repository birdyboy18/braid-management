var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var entry = new Schema({
  id: { type: String },
  _threadId: { type: Schema.Types.ObjectId },
  service: { type: String },
  active: { type: Boolean, default: true},
  data: { type: Schema.Types.Mixed },
  modifiers: [{ type: Schema.Types.Mixed }]
}, { collection: 'entries'});

module.exports = mongoose.model('Entry', entry);
