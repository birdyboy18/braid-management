var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var braid = new Schema({
  _id: Schema.Types.ObjectId,
  _userId: String,
  name: String,
  description: String,
  last_modified: { type: Date, default: Date.now },
  created: {type: Date, default: Date.now },
  threads: [{ type: Schema.Types.ObjectId, ref: 'Thread'}]
});

module.exports = mongoose.model('Braid', braid);
