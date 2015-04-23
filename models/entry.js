var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var entry = new Schema({
  id: { type: String },
  _threadId: { type: Schema.Types.ObjectId },
  service: { type: String },
  data: { type: Schema.Types.Mixed }
}, { collection: 'entries'});

module.exports = mongoose.model('Entry', entry);
