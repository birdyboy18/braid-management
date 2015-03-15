


module.exports = {
  braid: function(req,res) {
    var braid = {
      '_id': 'h30f9y',
      'name': 'Test Braid',
      'description': 'A test braid',
      'user': {
        '_id': '0fg84j',
        'name': 'John Doe'
      },
      'threads_count': 1,
      'threads': [
        {
          '_id': '9f0ge7',
          'name': 'Youtube test',
          'service': 'Youtube',
          'modifiers': [
            {
              '_id': '0fh784',
              'slug': 'category',
              'name_singular': 'category',
              'name_plural': 'categories',
              'values': [
                'sport',
                'news'
              ]
            }
          ]
        }
      ]
    };
    res.json(braid);
  },
  user: function(req,res) {

  },
  thread: function(req,res) {

  }
}
