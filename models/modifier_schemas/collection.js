/*
Schema structure for a modifier of type collection.
This will embed, the required data structure once an entry knows what type of modifier is being applied.
*/

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var collection = new Schema({
  terms: { type: Array },
  slug: { type: String },
  slug_singular: {type: String }
}, { _id: false });

var collectionEntry = new Schema({
	_modId: { type: Schema.Types.ObjectId },
    type: {type: String},
    slug: {type: String},
    slug_singular: {type: String},
    terms: [{ type: String }]
}, { _id: false})

module.exports = {
	Collection: mongoose.model('Collection', collection),
	CollectionEntry: mongoose.model('CollectionEntry', collectionEntry)
}
