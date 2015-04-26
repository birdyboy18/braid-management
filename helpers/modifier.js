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
  }
}

module.exports = modifier;
