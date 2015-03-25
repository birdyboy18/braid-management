var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var thread = new Schema({
  _id: Schema.Types.ObjectId,
  _braidId: Schema.Types.ObjectId,
  _userId: String,
  status: { type: Boolean, default: false},
  service: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  poll_time: { type: Number, default: 15 },
  last_checked: {type: Date, default: Date.now },
  entries: [Schema.Types.ObjectId],
  modifiers: [Schema.Types.ObjectId]
});

module.exports = mongoose.model('Thread', thread);
