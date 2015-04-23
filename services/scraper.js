/*
A service that will look up every thread in the database check when it was last scraped,
track it and then scrape the needed threads.
*/
var Models = require('../models');
var request = require('request');
var config = require('../config.js');
var ServiceModels = require('../models/service_schemas');

module.exports = function() {
  var scraper = {}

  scraper.threads = [];

  scraper.getThreads = function(cb) {
    Models.Thread.find({},{},{}, function(err, threads){
      if (err) { throw err;};

      threads.map(function(thread){
        if (thread.active) {
          scraper.threads.push({
            _id: thread._id,
            name: thread.name,
            service: thread.service,
            modifiers: thread.modifiers,
            poll_time: thread.poll_time,
            last_checked: thread.last_checked,
            service_meta: thread.service_meta
          });
        }
        cb(scraper.threads);
      });

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
        // console.log(data.items);

        data.items.map(function(result){
          Models.Entry.find({ id: result.id }, function(err, entries) {
            if (entries > 0) {
              //it exists so don't add the same one again silly.
              console.log("Entry already is in database");
            } else {
              //Lets add the new ones in!
              var youtubeEntry = new ServiceModels.YouTube.YouTube({
                id: result.id,
                videoId: result.snippet.resourceId.videoId,
                publishedAt: result.snippet.publishedAt,
                channelId: result.snippet.channelId,
                channelTitle: result.channelTitle,
                playlistId: result.playlistID,
                title: result.snippet.title,
                description: result.snippet.description,
                thumbnails: {
                  default: {
                    url: result.snippet.thumbnails.default.url,
                    width: result.snippet.thumbnails.default.width,
                    height: result.snippet.thumbnails.default.height
                  },
                  medium: {
                    url: result.snippet.thumbnails.medium.url,
                    width: result.snippet.thumbnails.medium.width,
                    height: result.snippet.thumbnails.medium.height
                  },
                  high: {
                    url: result.snippet.thumbnails.high.url,
                    width: result.snippet.thumbnails.high.width,
                    height: result.snippet.thumbnails.high.height
                  },
                  standard: {
                    url: result.snippet.thumbnails.standard.url,
                    width: result.snippet.thumbnails.standard.width,
                    height: result.snippet.thumbnails.standard.height
                  }
                  // maxres: {
                  //   url: result.snippet.thumbnails.maxres.url || '',
                  //   width: result.snippet.thumbnails.maxres.width || '',
                  //   height: result.snippet.thumbnails.maxres.height || ''
                  // }
                }
              });

              var newEntry = new Models.Entry({
                id: result.id,
                _threadId: thread._id,
                service: thread.service,
                data: youtubeEntry
              });

              newEntry.save(function(err, entry){
                if (err) { throw err;};

                Models.Thread.findOneAndUpdate({ _id: thread._id },{ last_checked: new Date()}, function(err, thread){
                  console.log('New entry succesfully added');
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
      threads.map(function(thread){
        var min = 1000*60;
        var now = new Date();
        var timeSinceChecked = Math.ceil((now.getTime() - thread.last_checked.getTime())/min);

        if (timeSinceChecked > thread.poll_time) {
          console.log("needs to be scraped, last scraped was " + timeSinceChecked + " mins ago");
          scraper.scrapeThread(thread);
        } else {
          console.log('None need scraping all up-to-date');
        }
      });
    });
  }

  return scraper;
}
