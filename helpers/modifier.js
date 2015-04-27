var Modifier = require('../models/modifier_schemas');

var modifier = {
  modifierDecider: function(type, options) {
    if (type === 'collection') {
      var modifier_meta = new Modifier.Collection({
        terms: [],
        slug: options.slug,
        slug_singular: options.slug_singular
      }, { _id: false });
      return modifier_meta;
    }
  },
  entryDecider: function(mod) {
    if (mod.type === 'collection') {
      var entry_meta = {
        _modId: mod._id,
        name: mod.name,
        type: mod.type,
        terms: []
      }
      return entry_meta
    }
  }
}

module.exports = modifier;
