var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var modifier = new Schema({
  _id: Schema.Types.ObjectId,
  _userId: String,
  type: String,
  name: String,
  description: String,
  threads: [{ type: Schema.Types.ObjectId, ref: 'Thread'}]
});

module.exports = mongoose.model('Modifier', modifier);
