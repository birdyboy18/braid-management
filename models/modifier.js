var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var modifier = new Schema({
  _id: Schema.Types.ObjectId,
  _userId: String,
  type: { type: String, required: true },
  name: { type: String, required: true },
  description: String,
  modifier_meta: { type: Schema.Types.Mixed, required: true},
  threads: [{ type: Schema.Types.ObjectId, ref: 'Thread'}]
});

module.exports = mongoose.model('Modifier', modifier);
