/*
A service that will look up every thread in the database check when it was last scraped,
track it and then scrape the needed threads.
*/
var Models = require('../models');
var request = require('request');
var config = require('../config.js');
var ServiceModels = require('../models/service_schemas');
var AppEmitter = require('../actions/app-emitter.js');
var _ = require('lodash');

module.exports = function() {
  var scraper = {}

  scraper.threads = [];

  scraper.getThreads = function(cb) {
    Models.Thread.find({},{},{}, function(err, threads){
      if (err) { throw err;};
      var Threads = [];
      threads.map(function(thread){
          Threads.push({
            _id: thread._id,
            name: thread.name,
            service: thread.service,
            modifiers: thread.modifiers,
            poll_time: thread.poll_time,
            last_checked: thread.last_checked,
            service_meta: thread.service_meta,
            active: thread.active
          });
      });
      cb(Threads);
    });
  },

  scraper.threadNeedsScraping = function(thread) {
    var min = 1000*60;
    var now = new Date();
    var timeSinceChecked = Math.ceil((now.getTime() - thread.last_checked.getTime())/min);

    if (timeSinceChecked > 15 && thread.active === true) {
      console.log("needs to be scraped, last scraped was " + timeSinceChecked + " mins ago");
      return true;
    } else {
      console.log('None need scraping all up-to-date: last checked - ' + timeSinceChecked + " mins ago");
      return false;
    }
  },

  scraper.scrapeThreads = function(threads) {
    threads.map(function(thread){
      if (scraper.threadNeedsScraping(thread) === true) {
        scraper.scrapeThread(thread);
      }
    });
  },

  scraper.scrapeThread = function(thread) {
    var key;
    var url;
    if (thread.service === 'youtube') {
      key = config.apiKeys.youtube;
      url = 'https://www.googleapis.com/youtube/v3/channels?part=contentDetails&key=' + key + '&forUsername=' + thread.service_meta.channel_username;
    }

    request.get(url, function(err,req,body){
      if (err) { throw err;};
      var data = JSON.parse(body)
      var playlistItemsUrl = 'https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&key=' + key + '&playlistId=' + data.items[0].contentDetails.relatedPlaylists.uploads + '&maxResults=50';

      request.get(playlistItemsUrl, function(err, req, body) {
        if (err) { throw err;};
        var data = JSON.parse(body);

        data.items.map(function(result){
          Models.Entry.find({ id: result.id }, function(err, entries) {
            if (entries.length > 0) {
              //it exists so don't add the same one again silly.
              Models.Thread.findOne({ _id: thread._id }, function(err, thread){
                if (err) { throw err;};

                thread.last_checked = new Date();

                thread.save(function(err, thread){
                  if (err) { throw err;};
                })
              })
            } else {
              //Lets add the new ones in!
              //we seem to be having problems with properties not being defined. Let lodash do the work for you
              var thumbnails = _.assign({}, result.snippet.thumbnails);
              var youtubeEntry = new ServiceModels.YouTube.YouTube({
                id: result.id,
                videoId: result.snippet.resourceId.videoId,
                publishedAt: result.snippet.publishedAt,
                channelId: result.snippet.channelId,
                channelTitle: result.channelTitle,
                playlistId: result.playlistID,
                title: result.snippet.title,
                description: result.snippet.description,
                thumbnails: thumbnails
              });

              var newEntry = new Models.Entry({
                id: result.id,
                _threadId: thread._id,
                service: thread.service,
                data: youtubeEntry
              });

              newEntry.save(function(err, entry){
                if (err) { throw err;};

                Models.Thread.findOne({ _id: thread._id }, function(err, thread){
                  thread.last_checked = new Date();
                  thread.entries.push(entry._id);

                  thread.save(function(err, thread){
                    console.log('New entry succesfully added: ' + entry.data.title);
                  });
                });

              });
            }
          });

        });
      });

    });
  },

  scraper.start = function() {
    scraper.getThreads(function(threads){
      scraper.threads = threads;
      console.log("before change: " + scraper.threads);
      scraper.scrapeThreads(scraper.threads);
    })


    /*
    Set up the scraper to listen for events when threads are created and deleted,
    simply update the scraper.threads from the database, then re-scrape
    */
    AppEmitter.addListener('threadChange', function(){
      scraper.getThreads(function(threads) {
        scraper.threads = threads;
        console.log("after change: " + scraper.threads);
        scraper.scrapeThreads(scraper.threads);
      });
    });
  }

  return scraper;
}
