/*
A service that will look up every thread in the database check when it was last scraped,
track it and then scrape the needed threads.
*/
var Models = require('../models');

module.exports = function() {
  var scraper = {}

  scraper.threads = [];

  scraper.getThreads = function(cb) {
    Models.Thread.find({},{},{}, function(err, threads){
      if (err) { throw err;};

      if (threads.length > 0) {
      threads.map(function(thread){
        scraper.threads.push({
          _id: thread._id,
          service: thread.service,
          modifiers: thread.modifiers,
          poll_time: thread.poll_time,
          last_checked: thread.last_checked
        });
        cb(scraper.threads);
      });
    } else {

    }
    });
  },

  scraper.scrapeThread = function(thread) {

  }

  scraper.start = function() {

  }

  return scraper;
}
