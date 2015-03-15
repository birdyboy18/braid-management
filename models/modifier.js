var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var modifier = new Schema({
  _id: Schema.Types.ObjectId,
  _userId: Schema.Types.ObjectId,
  type: String,
  name: String,
  description: String,
  threads: [{ type: Schema.Types.ObjectId, ref: 'Thread'}]
});

module.export = mongoose.model('Modifier', modifier);
