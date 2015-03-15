var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var thread = new Schema({
  _id: Schema.Types.ObjectId,
  _braidId: Schema.Types.ObjectId,
  name: String,
  description: String,
  poll_time: Number,
  last_checked: {type: Date, default: Date.now },
  entries: [Schema.Types.ObjectId],
  modifiers: [Schema.Types.ObjectId]
});

module.exports = mongoose.model('Thread', thread);
