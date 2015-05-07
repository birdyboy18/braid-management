var Modifier = require('../models/modifier_schemas');

var modifier = {
  modifierDecider: function(type, options) {
    if (type === 'collection') {
      var modifier_meta = new Modifier.Collection.Collection({
        terms: [],
        slug: options.slug,
        slug_singular: options.slug_singular
      }, { _id: false });
      return modifier_meta;
    }
  },
  entryDecider: function(options) {
    if (options.type === 'collection') {
      var entry_meta = new Modifier.Collection.CollectionEntry({
        _modId: options._modId,
        name: options.name,
        type: options.type,
        slug: options.slug,
        slug_singular: options.slug_singular,
        terms: []
      });
      return entry_meta;
    }
  }
}

module.exports = modifier;
