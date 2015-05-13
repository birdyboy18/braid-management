/*
It used to return the correct service-meta data when creating a new thread resource.
*/
var Service = require('../models/service_schemas');

var service = {
  serviceDecider: function(service, username) {
    if (service === 'youtube') {
      var service_meta = new Service.YouTube.YoutubeMeta({
        channel_username: username
      }, { _id: false });
      return service_meta;
    }
  }
}

module.exports = service;
